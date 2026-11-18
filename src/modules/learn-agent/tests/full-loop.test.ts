import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import { registerUser } from "../../auth/services/auth-service.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserLearningSlots } from "../../plan-agent/models/UserLearningSlots.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { TelemetryEvent } from "../../telemetry/models/TelemetryEvent.js";
import { useTemporaryJsonl } from "../../telemetry/tests/temporary-jsonl.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { AttemptLog } from "../models/AttemptLog.js";
import { evaluateUserIntent } from "../../plan-agent/services/clarify-service.js";
import { getNextDiagnosticNode } from "../../plan-agent/services/diagnostic-engine.js";
import {
  evaluateDiagnosticResponse,
  generateDiagnosticQuestion,
} from "../../plan-agent/services/diagnostic-questioner.js";
import { processDiagnosticAnswer } from "../../plan-agent/services/diagnostic-evaluator.js";
import { createLearningPlan } from "../../plan-agent/services/plan-service.js";
import { getOuterFringe } from "../services/outer-fringe.js";
import { loadLearningNodeState, prepareNodeLesson, submitNodeAttempt } from "../services/micro-tutor.js";
import type { WmlAssessment } from "../types/wml.js";
import { createFetchStub } from "./fetch-stub.js";

interface NodeDefinition {
  conceptName: string;
  bloomLevel: number;
  prerequisites?: string[];
  status?: "PASSED_IN_DIAGNOSTIC" | "PENDING" | "IN_PROGRESS" | "MASTERED";
}

async function createPlanFixture(
  userId: string,
  topic: string,
  definitions: NodeDefinition[],
  status: "DIAGNOSTIC_IN_PROGRESS" | "READY" | "COMPLETED" = "READY",
) {
  const plan = await Plan.create({ userId, topic, targetDepth: 6, status });
  const nodeIds = new Map(
    definitions.map((definition) => [definition.conceptName, new Types.ObjectId()]),
  );
  const nodes = await PlanNode.create(definitions.map((definition) => ({
    _id: nodeIds.get(definition.conceptName),
    planId: plan._id,
    conceptName: definition.conceptName,
    bloomLevel: definition.bloomLevel,
    status: definition.status ?? "PENDING",
    prerequisites: (definition.prerequisites ?? []).map((name) => {
      const prerequisiteId = nodeIds.get(name);
      if (!prerequisiteId) throw new Error(`Unknown fixture prerequisite: ${name}`);
      return prerequisiteId;
    }),
  })));
  return { plan, nodes };
}

const simpleLesson = {
  explanation: "A closure retains access to its lexical scope.",
  checkQuestion: "What does a closure retain?",
  expectedCriteria: "It retains access to lexical scope.",
};

const testWmlAssessment: WmlAssessment = {
  intrinsic: { bloomFactor: 0.2, directPrereqFactor: 0.25, transitiveDepthFactor: 0.125, score: 0.2 },
  extrinsic: { sentenceLengthFactor: 0.1, lexicalDensityFactor: 0.2, codeDensityFactor: 0, novelTermFactor: 0.1, score: 0.12 },
  totalWml: 0.42,
  capacityThreshold: 0.70,
  loadLevel: "OPTIMAL",
  isOverloaded: false,
  scaffoldingDirectives: [],
};

const denseLesson = {
  explanation: "A sophisticated implementation coordinates lexical environments, mutable bindings, and deferred execution.\n```javascript\nconst scope = { value: 1 };\nfunction createClosure() { return () => scope.value; }\n``` Closure Applications reveal how this abstraction preserves contextual references.",
  checkQuestion: "How does the implementation retain its contextual reference?",
  expectedCriteria: "The closure retains access to the lexical environment.",
};

test("Fetch stub captures Gemini calls and rejects unqueued requests", async (t) => {
  const stub = createFetchStub(t);
  stub.enqueue({ explanation: "A lesson", checkQuestion: "A question", expectedCriteria: "A criterion" });

  const response = await fetch("https://example.test/generate?key=test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Teach this concept" }] }] }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json");
  assert.equal(stub.calls.length, 1);
  assert.equal(stub.calls[0].method, "POST");
  assert.equal(stub.calls[0].headers.get("content-type"), "application/json");
  assert.equal(stub.calls[0].prompt, "Teach this concept");
  assert.deepEqual(await response.json(), {
    candidates: [{
      content: { parts: [{ text: JSON.stringify({
        explanation: "A lesson",
        checkQuestion: "A question",
        expectedCriteria: "A criterion",
      }) }] },
    }],
  });
  await assert.rejects(
    fetch("https://example.test/unexpected"),
    /Unexpected unstubbed fetch call/,
  );
});

test(
  "Deterministic mocked tests cover the full Plan Agent and Learn Agent loop",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await useTemporaryJsonl(t);
    await connectToDatabase();
    const email = `full-loop-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
    let userId: string | undefined;
    t.after(async () => {
      const user = userId
        ? await User.findById(userId).select("_id")
        : await User.findOne({ email }).select("_id");
      if (user) {
        const plans = await Plan.find({ userId: user._id }).select("_id");
        const planIds = plans.map((plan) => plan._id);
        await AttemptLog.deleteMany({ userId: user._id });
        await TelemetryEvent.deleteMany({ userId: user._id });
        await PlanNode.deleteMany({ planId: { $in: planIds } });
        await Plan.deleteMany({ userId: user._id });
        await UserLearningSlots.deleteMany({ userId: user._id });
        await UserMastery.deleteMany({ userId: user._id.toString() });
        await User.deleteOne({ _id: user._id });
      }
      await disconnectFromDatabase();
    });

    const registration = await registerUser(email, "full-loop-test-password", "Full Loop Test");
    userId = registration.user.userId;
    const harness = createFetchStub(t);
    const apiKey = "deterministic-test-key";

    await t.test("prepareNodeLesson enters progress and only regenerates overload once", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Tutor capacity", [
        { conceptName: "Basic Recall", bloomLevel: 1 },
      ]);
      await Plan.updateOne({ _id: plan._id }, { $set: { capacityThreshold: 0.62 } });
      const requestStart = harness.calls.length;
      harness.enqueue(simpleLesson);
      const turn = await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId: nodes[0]._id.toString(),
        apiKey,
      });
      assert.equal((await PlanNode.findById(nodes[0]._id))?.status, "IN_PROGRESS");
      assert.equal(turn.wasRegeneratedForOverload, false);
      assert.equal(turn.preGate.extrinsicBudget, 0.62);
      assert.equal(turn.wmlAssessment.capacityThreshold, 0.62);
      assert.equal(harness.calls.length - requestStart, 1);
      assert.match(harness.calls[requestStart].url, /generativelanguage\.googleapis\.com/);
      assert.equal(harness.calls[requestStart].method, "POST");
      assert.equal(harness.calls[requestStart].headers.get("content-type"), "application/json");
      assert.equal(harness.calls[requestStart].body.generationConfig?.responseMimeType, "application/json");
      assert.ok(harness.calls[requestStart].prompt.includes("Basic Recall"));
      const lowLoadDirective = turn.wmlAssessment.scaffoldingDirectives.find((directive) =>
        directive.includes("Learner cognitive load is low"),
      );
      assert.ok(lowLoadDirective, "LOW-load directives should be available to the next tutor turn");
      harness.enqueue(simpleLesson);
      await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId: nodes[0]._id.toString(),
        apiKey,
        capacityThreshold: 0.90,
        scaffoldingDirectives: [lowLoadDirective],
      });
      assert.ok(harness.calls[harness.calls.length - 1].prompt.includes(lowLoadDirective));

      const prerequisiteDefinitions = Array.from({ length: 4 }, (_, index) => ({
        conceptName: `Known prerequisite ${index + 1}`,
        bloomLevel: 1,
        status: "MASTERED" as const,
      }));
      const { plan: overloadPlan, nodes: overloadNodes } = await createPlanFixture(
        userId!,
        "Tutor overload",
        [
          ...prerequisiteDefinitions,
          {
            conceptName: "Advanced Synthesis",
            bloomLevel: 6,
            prerequisites: prerequisiteDefinitions.map((node) => node.conceptName),
          },
        ],
      );
      const overloadNode = overloadNodes[overloadNodes.length - 1];
      const upfrontStart = harness.calls.length;
      harness.enqueue(simpleLesson);
      const proactiveTurn = await prepareNodeLesson({
        planId: overloadPlan._id.toString(),
        userId: userId!,
        nodeId: overloadNode._id.toString(),
        apiKey,
        capacityThreshold: 0.90,
      });
      assert.equal(proactiveTurn.wmlAssessment.isOverloaded, false);
      assert.equal(harness.calls.length - upfrontStart, 1);
      assert.ok(
        harness.calls[upfrontStart].prompt.includes(
          "Decompose the concept into one atomic sub-step",
        ),
      );
      const overloadStart = harness.calls.length;
      harness.enqueue(denseLesson);
      harness.enqueue(denseLesson);
      const overloadedTurn = await prepareNodeLesson({
        planId: overloadPlan._id.toString(),
        userId: userId!,
        nodeId: overloadNode._id.toString(),
        apiKey,
        capacityThreshold: 0.45,
      });
      assert.equal(overloadedTurn.wasRegeneratedForOverload, true);
      assert.equal(overloadedTurn.wmlAssessment.isOverloaded, true);
      assert.equal(harness.calls.length - overloadStart, 2, "System 1 permits only one regeneration retry");
      assert.equal(overloadedTurn.lesson.explanation, denseLesson.explanation);
      assert.ok(harness.calls[overloadStart + 1].prompt.includes("End with a single"));
      assert.ok(harness.calls[overloadStart + 1].prompt.includes("Decompose the concept into one atomic sub-step"));
      assert.ok(!harness.calls[overloadStart].prompt.includes("End with a single"));
      harness.assertDrained();
    });

    await t.test("prepareNodeLesson rejects invalid and unowned identifiers before fetch", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Ownership", [
        { conceptName: "Owned Node", bloomLevel: 1 },
      ]);
      const requestStart = harness.calls.length;
      const validPlanId = plan._id.toString();
      const validNodeId = nodes[0]._id.toString();

      await assert.rejects(
        prepareNodeLesson({ planId: "invalid-plan", userId: userId!, nodeId: validNodeId, apiKey }),
        /valid plan ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({ planId: validPlanId, userId: "invalid-user", nodeId: validNodeId, apiKey }),
        /valid authenticated user ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({ planId: validPlanId, userId: userId!, nodeId: "invalid-node", apiKey }),
        /valid plan node ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({
          planId: validPlanId,
          userId: new Types.ObjectId().toString(),
          nodeId: validNodeId,
          apiKey,
        }),
        /Plan not found for the authenticated user/,
      );
      assert.equal(harness.calls.length, requestStart);
    });

    await t.test("failed attempts retain progress and remediation includes prior answer and feedback", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Remediation", [
        { conceptName: "Lexical Scope", bloomLevel: 2, status: "IN_PROGRESS" },
      ]);
      const nodeId = nodes[0]._id.toString();
      harness.enqueue({ mastered: false, feedback: "Distinguish retained scope from copied values.", hint: "Track the outer binding." });
      const failed = await submitNodeAttempt({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        lesson: simpleLesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "It copies the value.",
        attemptCount: 1,
        averageWml: 0.5,
        capacityThreshold: 0.74,
        wmlSamples: [0.5],
        apiKey,
      });
      assert.equal(failed.mastered, false);
      assert.equal(failed.feedback, "Distinguish retained scope from copied values.");
      assert.equal(failed.masteryScore, 0.25);
      const failedNode = await PlanNode.findById(nodeId);
      assert.equal(failedNode?.status, "IN_PROGRESS");
      assert.equal(failedNode?.attemptCount, 1);
      assert.deepEqual(failedNode?.wmlSamples, [0.5]);
      assert.equal(failedNode?.lastAttempt, "It copies the value.");
      assert.ok(failedNode?.lastTutorFeedback?.includes("Distinguish retained scope"));
      assert.ok(failedNode?.lastTutorFeedback?.includes("Track the outer binding."));
      assert.deepEqual(failedNode?.attempts.map((attempt) => ({
        attemptNumber: attempt.attemptNumber,
        learnerAnswer: attempt.learnerAnswer,
        wmlScore: attempt.wmlScore,
        passed: attempt.passed,
      })), [{
        attemptNumber: 1,
        learnerAnswer: "It copies the value.",
        wmlScore: 0.5,
        passed: false,
      }]);
      const persistedAttempt = await AttemptLog.findOne({ planId: plan._id, nodeId });
      assert.ok(persistedAttempt);
      assert.equal(persistedAttempt.userAnswer, "It copies the value.");
      assert.equal(persistedAttempt.wmlScore.intrinsic.score, testWmlAssessment.intrinsic.score);
      assert.equal(persistedAttempt.wmlScore.extrinsic.score, testWmlAssessment.extrinsic.score);
      assert.equal(persistedAttempt.wmlScore.totalWml, testWmlAssessment.totalWml);
      assert.equal(persistedAttempt.wmlScore.capacityThreshold, testWmlAssessment.capacityThreshold);
      assert.equal(persistedAttempt.wmlScore.isOverloaded, testWmlAssessment.isOverloaded);
      assert.equal(persistedAttempt.isCorrect, false);
      assert.equal(
        persistedAttempt.tutorFeedback,
        "Distinguish retained scope from copied values. Track the outer binding.",
      );
      const resumed = await loadLearningNodeState(plan._id.toString(), userId!, nodeId);
      assert.equal(resumed.capacityThreshold, 0.74);
      assert.equal((await User.findById(userId))?.capacityThreshold, 0.74);
      assert.equal(resumed.attemptCount, 1);
      assert.deepEqual(resumed.wmlSamples, [0.5]);
      assert.equal(resumed.previousAttempt, "It copies the value.");
      assert.ok(resumed.tutorFeedback?.includes("Distinguish retained scope"));
      assert.equal(await UserMastery.countDocuments({
        userId,
        conceptKey: "lexical scope",
      }), 0);

      const requestStart = harness.calls.length;
      harness.enqueue(simpleLesson);
      await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        apiKey,
      });
      const remediationPrompt = harness.calls[requestStart].prompt;
      assert.ok(remediationPrompt.includes("It copies the value."));
      assert.ok(remediationPrompt.includes("Distinguish retained scope from copied values."));
      assert.ok(remediationPrompt.includes("Track the outer binding."));
      assert.ok(remediationPrompt.includes("Prior Mistake History"));
      assert.ok(remediationPrompt.includes("WML: OPTIMAL"));
    });

    await t.test("attempt logs persist passing and failing answers with durable sequence numbers", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Attempt log sequence", [
        { conceptName: "Persistent Attempts", bloomLevel: 2, status: "IN_PROGRESS" },
      ]);
      const nodeId = nodes[0]._id.toString();
      harness.enqueue({ mastered: false, feedback: "Revisit the distinction.", hint: null });
      await submitNodeAttempt({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        lesson: simpleLesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "First answer",
        attemptCount: 9,
        averageWml: 0.42,
        apiKey,
      });
      harness.enqueue({ mastered: true, feedback: "That is correct.", hint: null });
      await submitNodeAttempt({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        lesson: simpleLesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "Correct answer",
        attemptCount: 10,
        averageWml: 0.42,
        apiKey,
      });
      const attempts = await AttemptLog.find({ planId: plan._id, nodeId }).sort({ attemptNumber: 1 });
      assert.deepEqual(attempts.map((attempt) => ({
        attemptNumber: attempt.attemptNumber,
        userAnswer: attempt.userAnswer,
        isCorrect: attempt.isCorrect,
      })), [
        { attemptNumber: 1, userAnswer: "First answer", isCorrect: false },
        { attemptNumber: 2, userAnswer: "Correct answer", isCorrect: true },
      ]);
      assert.equal(attempts[0].questionPrompt, simpleLesson.checkQuestion);
      assert.equal(attempts[0].taskContext, simpleLesson.explanation);
    });

    await t.test("mastery scores upsert by attempt and preserve a higher cross-plan score", async () => {
      const masteryDefinitions = [
        { conceptName: "  Shared   Mastery Concept  ", bloomLevel: 2 },
        { conceptName: "Attempt 2 Mastery", bloomLevel: 2 },
        { conceptName: "Attempt 3 Mastery", bloomLevel: 2 },
      ];
      const { plan, nodes } = await createPlanFixture(userId!, "Durable mastery", masteryDefinitions);
      for (const [index, attemptCount] of [1, 2, 3].entries()) {
        harness.enqueue({ mastered: true, feedback: "Correct.", hint: null });
        const evaluation = await submitNodeAttempt({
          planId: plan._id.toString(),
          userId: userId!,
          nodeId: nodes[index]._id.toString(),
          lesson: simpleLesson,
          wmlAssessment: testWmlAssessment,
          userAnswer: "Correct answer.",
          attemptCount,
          averageWml: 0.2,
          capacityThreshold: 0.70,
          apiKey,
        });
        const expectedScore = [0.95, 0.90, 0.86][index];
        assert.equal(evaluation.masteryScore, expectedScore);
        assert.ok(evaluation.updatedCapacityThreshold >= 0.45);
        assert.ok(evaluation.updatedCapacityThreshold <= 0.90);
        const masteredNode = await PlanNode.findById(nodes[index]._id);
        assert.equal(masteredNode?.status, "MASTERED");
        assert.equal(masteredNode?.attempts.at(-1)?.passed, true);
        assert.equal((await Plan.findById(plan._id))?.capacityThreshold, evaluation.updatedCapacityThreshold);
        assert.equal((await UserMastery.findOne({
          userId,
          conceptKey: normalizeConceptName(masteryDefinitions[index].conceptName),
        }))?.masteryScore, expectedScore);
      }

      const laterPlan = await createPlanFixture(userId!, "Later mastery", [
        { conceptName: "shared mastery concept", bloomLevel: 2 },
      ]);
      harness.enqueue({ mastered: true, feedback: "Correct again.", hint: null });
      const laterEvaluation = await submitNodeAttempt({
        planId: laterPlan.plan._id.toString(),
        userId: userId!,
        nodeId: laterPlan.nodes[0]._id.toString(),
        lesson: simpleLesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "Correct answer.",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: 0.70,
        apiKey,
      });
      assert.equal(laterEvaluation.masteryScore, 0.86);
      assert.equal((await UserMastery.findOne({
        userId,
        conceptKey: "shared mastery concept",
      }))?.masteryScore, 0.95);
    });

    await t.test("full plan loop diagnoses, teaches, remediates, and credits prior mastery", async () => {
      harness.enqueue({
        slots: { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null },
        isComplete: false,
        nextQuestion: "Which language and goal do you have in mind?",
      });
      const ambiguous = await evaluateUserIntent(userId!, "I want to learn programming", apiKey);
      assert.equal(ambiguous.isComplete, false);

      harness.enqueue({
        slots: {
          targetLanguageOrTool: "JavaScript",
          specificSubdomain: "closures",
          targetDepth: 3,
        },
        isComplete: true,
        nextQuestion: null,
      });
      const scoped = await evaluateUserIntent(
        userId!,
        "Teach me JavaScript closures at Bloom level 3.",
        apiKey,
      );
      assert.equal(scoped.isComplete, true);

      harness.enqueue([
        { conceptName: "Closure Axiom", bloomLevel: 1, prerequisiteNames: [] },
        { conceptName: "Lexical Scope", bloomLevel: 2, prerequisiteNames: ["Closure Axiom"] },
        { conceptName: "JavaScript Closures", bloomLevel: 3, prerequisiteNames: ["Lexical Scope"] },
        { conceptName: "Closure Applications", bloomLevel: 3, prerequisiteNames: ["Lexical Scope"] },
      ]);
      const plan = await createLearningPlan(userId!, "JavaScript closures", 3, apiKey);
      const planId = plan._id.toString();
      const nodes = await PlanNode.find({ planId });
      assert.equal(nodes.length, 4);
      const nodeByName = new Map(nodes.map((node) => [node.conceptName, node]));

      const middleNode = await getNextDiagnosticNode(planId, userId!);
      assert.equal(middleNode?.conceptName, "Lexical Scope");
      assert.ok(middleNode);
      harness.enqueue({ question: "What does lexical scope retain?", expectedCriteria: "The surrounding lexical environment." });
      const diagnosticQuestion = await generateDiagnosticQuestion(
        plan.topic,
        middleNode.conceptName,
        middleNode.bloomLevel,
        apiKey,
      );
      harness.enqueue({ passed: true, feedback: "Correctly identified the surrounding environment." });
      const diagnosticResult = await evaluateDiagnosticResponse(
        plan.topic,
        middleNode.conceptName,
        middleNode.bloomLevel,
        diagnosticQuestion.question,
        diagnosticQuestion.expectedCriteria,
        "It retains the surrounding lexical environment.",
        apiKey,
      );
      assert.equal(diagnosticResult.passed, true);
      await processDiagnosticAnswer(middleNode._id.toString(), true, userId!);
      assert.equal((await PlanNode.findById(nodeByName.get("Closure Axiom")!._id))?.status, "PASSED_IN_DIAGNOSTIC");
      assert.equal((await PlanNode.findById(middleNode._id))?.status, "PASSED_IN_DIAGNOSTIC");

      let nextDiagnostic = await getNextDiagnosticNode(planId, userId!);
      while (nextDiagnostic) {
        harness.enqueue({ question: `Explain ${nextDiagnostic.conceptName}.`, expectedCriteria: "A correct explanation." });
        const question = await generateDiagnosticQuestion(
          plan.topic,
          nextDiagnostic.conceptName,
          nextDiagnostic.bloomLevel,
          apiKey,
        );
        harness.enqueue({ passed: false, feedback: "This node remains for guided learning." });
        const evaluation = await evaluateDiagnosticResponse(
          plan.topic,
          nextDiagnostic.conceptName,
          nextDiagnostic.bloomLevel,
          question.question,
          question.expectedCriteria,
          "I am not sure.",
          apiKey,
        );
        assert.equal(evaluation.passed, false);
        await processDiagnosticAnswer(nextDiagnostic._id.toString(), false, userId!);
        nextDiagnostic = await getNextDiagnosticNode(planId, userId!);
      }
      assert.equal(await PlanNode.countDocuments({ planId, status: "PENDING" }), 0);
      await Plan.updateOne({ _id: plan._id, userId }, { $set: { status: "READY" } });
      assert.equal((await Plan.findById(plan._id))?.status, "READY");

      let completed = false;
      let learningTurns = 0;
      while (!completed && learningTurns < 8) {
        const fringe = await getOuterFringe(planId, userId!);
        if (fringe.isPlanCompleted) {
          completed = true;
          break;
        }
        assert.ok(fringe.nextNodeId, "an incomplete plan should expose a next node");
        const node = await PlanNode.findById(fringe.nextNodeId);
        assert.ok(node);
        learningTurns += 1;

        if (node.conceptName === "JavaScript Closures") {
          harness.enqueue(simpleLesson);
          const firstTurn = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.70,
          });
          harness.enqueue({ mastered: false, feedback: "Explain retained scope rather than copied values.", hint: "Look at the outer binding." });
          const failedAttempt = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: firstTurn.lesson,
            wmlAssessment: firstTurn.wmlAssessment,
            userAnswer: "The closure copies the value.",
            attemptCount: 1,
            averageWml: 0.6,
            capacityThreshold: 0.70,
            apiKey,
          });
          assert.equal(failedAttempt.mastered, false);

          const remediationStart = harness.calls.length;
          harness.enqueue(simpleLesson);
          const remediationTurn = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.70,
            previousAttempt: "The closure copies the value.",
            tutorFeedback: failedAttempt.feedback,
          });
          assert.ok(harness.calls[remediationStart].prompt.includes("The closure copies the value."));
          assert.ok(harness.calls[remediationStart].prompt.includes(failedAttempt.feedback));
          harness.enqueue({ mastered: true, feedback: "Correctly described retained scope.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: remediationTurn.lesson,
            wmlAssessment: remediationTurn.wmlAssessment,
            userAnswer: "It retains access to the outer lexical environment.",
            attemptCount: 2,
            averageWml: 0.4,
            capacityThreshold: 0.70,
            apiKey,
          });
          assert.equal(mastered.mastered, true);
          assert.ok(mastered.updatedCapacityThreshold >= 0.45 && mastered.updatedCapacityThreshold <= 0.90);
        } else {
          assert.equal(node.conceptName, "Closure Applications");
          const overloadStart = harness.calls.length;
          harness.enqueue(denseLesson);
          harness.enqueue(denseLesson);
          const overloaded = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.40,
          });
          assert.equal(overloaded.wasRegeneratedForOverload, true);
          assert.equal(overloaded.wmlAssessment.isOverloaded, true);
          assert.equal(harness.calls.length - overloadStart, 2);
          assert.ok(harness.calls[overloadStart + 1].prompt.includes("End with a single"));

          harness.enqueue({ mastered: true, feedback: "Correctly applied the closure model.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: overloaded.lesson,
            wmlAssessment: overloaded.wmlAssessment,
            userAnswer: "The closure can be used to retain and apply scoped state.",
            attemptCount: 1,
            averageWml: 0.2,
            capacityThreshold: 0.40,
            apiKey,
          });
          assert.equal(mastered.mastered, true);
          assert.ok(mastered.updatedCapacityThreshold >= 0.45 && mastered.updatedCapacityThreshold <= 0.90);
        }
      }
      assert.equal(completed, true);
      assert.equal((await Plan.findById(plan._id))?.status, "COMPLETED");
      assert.equal((await getOuterFringe(planId, userId!)).isPlanCompleted, true);

      harness.enqueue([
        { conceptName: "javascript closures", bloomLevel: 3, prerequisiteNames: [] },
      ]);
      const secondPlan = await createLearningPlan(userId!, "Closures review", 3, apiKey);
      const fetchCountBeforeCredit = harness.calls.length;
      const creditedFringe = await getOuterFringe(secondPlan._id.toString(), userId!);
      assert.equal(creditedFringe.isPlanCompleted, true);
      assert.equal(creditedFringe.remainingCount, 0);
      assert.equal(harness.calls.length, fetchCountBeforeCredit);
      assert.equal((await PlanNode.findOne({ planId: secondPlan._id }))?.status, "MASTERED");
      harness.assertDrained();
    });
  },
);