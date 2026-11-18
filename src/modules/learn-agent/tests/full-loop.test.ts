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

interface GeminiRequestBody {
  systemInstruction?: { parts?: Array<{ text?: string }> };
  contents?: Array<{ parts?: Array<{ text?: string }> }>;
  [key: string]: unknown;
}

interface CapturedGeminiRequest {
  url: string;
  body: GeminiRequestBody;
  prompt: string;
}

function createFetchHarness() {
  const replies: Array<(request: CapturedGeminiRequest) => unknown> = [];
  const requests: CapturedGeminiRequest[] = [];
  const unexpectedRequests: CapturedGeminiRequest[] = [];

  const fetchMock: typeof fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as GeminiRequestBody;
    const prompt = [
      ...(body.systemInstruction?.parts ?? []).map((part) => part.text ?? ""),
      ...(body.contents ?? []).flatMap((content) =>
        (content.parts ?? []).map((part) => part.text ?? ""),
      ),
    ].join("\n");
    const request = { url: String(input), body, prompt };
    requests.push(request);

    const reply = replies.shift();
    if (!reply) {
      unexpectedRequests.push(request);
      return new Response(JSON.stringify({ error: { message: "Unexpected mock fetch" } }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = reply(request);
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  return {
    fetchMock,
    requests,
    enqueue(reply: unknown) {
      replies.push(() => reply);
    },
    route(handler: (request: CapturedGeminiRequest) => unknown) {
      replies.push(handler);
    },
    assertDrained() {
      assert.equal(replies.length, 0, "all queued Gemini replies should be consumed");
      assert.deepEqual(unexpectedRequests, [], "no unplanned fetch should be made");
    },
  };
}

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

const denseLesson = {
  explanation: "A sophisticated implementation coordinates lexical environments, mutable bindings, and deferred execution.\n```javascript\nconst scope = { value: 1 };\nfunction createClosure() { return () => scope.value; }\n``` Closure Applications reveal how this abstraction preserves contextual references.",
  checkQuestion: "How does the implementation retain its contextual reference?",
  expectedCriteria: "The closure retains access to the lexical environment.",
};

test(
  "Deterministic mocked tests cover the full Plan Agent and Learn Agent loop",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await connectToDatabase();
    const originalFetch = globalThis.fetch;
    const email = `full-loop-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
    let userId: string | undefined;
    t.after(async () => {
      globalThis.fetch = originalFetch;
      const user = userId
        ? await User.findById(userId).select("_id")
        : await User.findOne({ email }).select("_id");
      if (user) {
        const plans = await Plan.find({ userId: user._id }).select("_id");
        const planIds = plans.map((plan) => plan._id);
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
    const harness = createFetchHarness();
    globalThis.fetch = harness.fetchMock;
    t.after(() => {
      globalThis.fetch = originalFetch;
    });
    const apiKey = "deterministic-test-key";

    await t.test("prepareNodeLesson enters progress and only regenerates overload once", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Tutor capacity", [
        { conceptName: "Basic Recall", bloomLevel: 1 },
      ]);
      const requestStart = harness.requests.length;
      harness.enqueue(simpleLesson);
      const turn = await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId: nodes[0]._id.toString(),
        apiKey,
        capacityThreshold: 0.90,
      });
      assert.equal((await PlanNode.findById(nodes[0]._id))?.status, "IN_PROGRESS");
      assert.equal(turn.wasRegeneratedForOverload, false);
      assert.equal(harness.requests.length - requestStart, 1);
      assert.ok(harness.requests[requestStart].prompt.includes("Basic Recall"));

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
      const overloadStart = harness.requests.length;
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
      assert.equal(harness.requests.length - overloadStart, 2);
      assert.ok(harness.requests[overloadStart + 1].prompt.includes("End with a single"));
      harness.assertDrained();
    });

    await t.test("prepareNodeLesson rejects invalid and unowned identifiers before fetch", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Ownership", [
        { conceptName: "Owned Node", bloomLevel: 1 },
      ]);
      const requestStart = harness.requests.length;
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
      assert.equal(harness.requests.length, requestStart);
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
        userAnswer: "It copies the value.",
        attemptCount: 1,
        averageWml: 0.5,
        capacityThreshold: 0.74,
        wmlSamples: [0.5],
        apiKey,
      });
      assert.equal(failed.mastered, false);
      const failedNode = await PlanNode.findById(nodeId);
      assert.equal(failedNode?.status, "IN_PROGRESS");
      assert.equal(failedNode?.attemptCount, 1);
      assert.deepEqual(failedNode?.wmlSamples, [0.5]);
      assert.equal(failedNode?.lastAttempt, "It copies the value.");
      assert.ok(failedNode?.lastTutorFeedback?.includes("Distinguish retained scope"));
      assert.ok(failedNode?.lastTutorFeedback?.includes("Track the outer binding."));
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

      const requestStart = harness.requests.length;
      harness.enqueue(simpleLesson);
      await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        apiKey,
        previousAttempt: "It copies the value.",
        tutorFeedback: failed.feedback,
      });
      const remediationPrompt = harness.requests[requestStart].prompt;
      assert.ok(remediationPrompt.includes("It copies the value."));
      assert.ok(remediationPrompt.includes("Distinguish retained scope from copied values."));
    });

    await t.test("mastery scores upsert by attempt and preserve a higher cross-plan score", async () => {
      const masteryDefinitions = [1, 2, 3].map((attemptCount) => ({
        conceptName: `Attempt ${attemptCount} Mastery`,
        bloomLevel: 2,
      }));
      const { plan, nodes } = await createPlanFixture(userId!, "Durable mastery", masteryDefinitions);
      for (const [index, attemptCount] of [1, 2, 3].entries()) {
        harness.enqueue({ mastered: true, feedback: "Correct.", hint: null });
        const evaluation = await submitNodeAttempt({
          planId: plan._id.toString(),
          userId: userId!,
          nodeId: nodes[index]._id.toString(),
          lesson: simpleLesson,
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
        assert.equal((await PlanNode.findById(nodes[index]._id))?.status, "MASTERED");
        assert.equal((await UserMastery.findOne({
          userId,
          conceptKey: masteryDefinitions[index].conceptName.trim().toLowerCase(),
        }))?.masteryScore, expectedScore);
      }

      const laterPlan = await createPlanFixture(userId!, "Later mastery", [
        { conceptName: "Attempt 1 Mastery", bloomLevel: 2 },
      ]);
      harness.enqueue({ mastered: true, feedback: "Correct again.", hint: null });
      const laterEvaluation = await submitNodeAttempt({
        planId: laterPlan.plan._id.toString(),
        userId: userId!,
        nodeId: laterPlan.nodes[0]._id.toString(),
        lesson: simpleLesson,
        userAnswer: "Correct answer.",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: 0.70,
        apiKey,
      });
      assert.equal(laterEvaluation.masteryScore, 0.86);
      assert.equal((await UserMastery.findOne({
        userId,
        conceptKey: "attempt 1 mastery",
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
            userAnswer: "The closure copies the value.",
            attemptCount: 1,
            averageWml: 0.6,
            capacityThreshold: 0.70,
            apiKey,
          });
          assert.equal(failedAttempt.mastered, false);

          const remediationStart = harness.requests.length;
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
          assert.ok(harness.requests[remediationStart].prompt.includes("The closure copies the value."));
          assert.ok(harness.requests[remediationStart].prompt.includes(failedAttempt.feedback));
          harness.enqueue({ mastered: true, feedback: "Correctly described retained scope.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: remediationTurn.lesson,
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
          const overloadStart = harness.requests.length;
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
          assert.equal(harness.requests.length - overloadStart, 2);
          assert.ok(harness.requests[overloadStart + 1].prompt.includes("End with a single"));

          harness.enqueue({ mastered: true, feedback: "Correctly applied the closure model.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: overloaded.lesson,
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
      const fetchCountBeforeCredit = harness.requests.length;
      const creditedFringe = await getOuterFringe(secondPlan._id.toString(), userId!);
      assert.equal(creditedFringe.isPlanCompleted, true);
      assert.equal(creditedFringe.remainingCount, 0);
      assert.equal(harness.requests.length, fetchCountBeforeCredit);
      assert.equal((await PlanNode.findOne({ planId: secondPlan._id }))?.status, "MASTERED");
      harness.assertDrained();
    });
  },
);