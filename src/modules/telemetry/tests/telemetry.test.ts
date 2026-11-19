import "dotenv/config";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { generateDiagnosticQuestion } from "../../plan-agent/services/diagnostic-questioner.js";
import { getNextDiagnosticNode } from "../../plan-agent/services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../../plan-agent/services/diagnostic-evaluator.js";
import { TelemetryEvent } from "../models/TelemetryEvent.js";
import { getTelemetryJsonlPath, recordTelemetryEvent } from "../services/telemetry-logger.js";
import { useTemporaryJsonl } from "./temporary-jsonl.js";
import { prepareNodeLesson, submitNodeAttempt } from "../../learn-agent/services/micro-tutor.js";
import { createFetchStub } from "../../learn-agent/tests/fetch-stub.js";

const simpleLesson = {
  explanation: "A short idea with one clear example.",
  checkQuestion: "What is the key idea?",
  expectedCriteria: "State the key idea.",
};

const denseLesson = {
  explanation: "A sophisticated implementation coordinates lexical environments, mutable bindings, and deferred execution.\n```javascript\nconst scope = { value: 1 };\nfunction createClosure() { return () => scope.value; }\n``` Closure applications preserve contextual references.",
  checkQuestion: "How does the implementation retain its contextual reference?",
  expectedCriteria: "It retains access to the lexical environment.",
};

test("recordTelemetryEvent appends a timestamped JSONL record and creates its parent directory", async (t) => {
  await useTemporaryJsonl(t);
  await recordTelemetryEvent({
    agent: "plan-agent",
    eventType: "test_event",
    conceptKey: "  Graph Theory  ",
    metrics: { rawNodeCount: 4, prunedNodeCount: 3 },
  });

  const lines = (await readFile(getTelemetryJsonlPath(), "utf8")).trim().split("\n");
  assert.equal(lines.length, 1);
  const event = JSON.parse(lines[0]) as {
    timestamp: string;
    sessionId: string;
    eventType: string;
    conceptKey: string;
    metrics: { rawNodeCount: number; prunedNodeCount: number };
  };
  assert.ok(Number.isFinite(Date.parse(event.timestamp)));
  assert.ok(event.sessionId);
  assert.equal(event.eventType, "test_event");
  assert.equal(event.conceptKey, "graph theory");
  assert.deepEqual(event.metrics, { rawNodeCount: 4, prunedNodeCount: 3 });
});

test(
  "tutoring and diagnostic flows persist structured events to MongoDB and JSONL",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await useTemporaryJsonl(t);
    await connectToDatabase();
    const email = `telemetry-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
    const user = await User.create({ email, passwordHash: "test-hash" });
    const plan = await Plan.create({
      userId: user._id,
      topic: "Telemetry evaluation",
      targetDepth: 6,
      status: "DIAGNOSTIC_IN_PROGRESS",
    });
    const prerequisites = await PlanNode.create(
      Array.from({ length: 4 }, (_, index) => ({
        planId: plan._id,
        conceptName: `Known concept ${index + 1}`,
        bloomLevel: 1,
        status: "MASTERED" as const,
        prerequisites: [],
      })),
    );
    const node = await PlanNode.create({
      planId: plan._id,
      conceptName: "Advanced synthesis",
      bloomLevel: 6,
      status: "PENDING",
      prerequisites: prerequisites.map((prerequisite) => prerequisite._id),
    });
    const harness = createFetchStub(t);

    t.after(async () => {
      const planIds = (await Plan.find({ userId: user._id }).select("_id")).map((ownedPlan) => ownedPlan._id);
      await TelemetryEvent.deleteMany({ planId: { $in: planIds } });
      await PlanNode.deleteMany({ planId: { $in: planIds } });
      await Plan.deleteMany({ userId: user._id });
      await User.deleteOne({ _id: user._id });
      await disconnectFromDatabase();
    });

    const selectedNode = await getNextDiagnosticNode(plan._id.toString(), user._id.toString());
    assert.equal(selectedNode?._id.toString(), node._id.toString());
    harness.enqueue({ question: "What does synthesis mean?", expectedCriteria: "Combine ideas." });
    await generateDiagnosticQuestion(
      plan.topic,
      node.conceptName,
      node.bloomLevel,
      "test-key",
      { planId: plan._id.toString(), userId: user._id.toString(), nodeId: node._id.toString() },
    );
    await processDiagnosticAnswer(node._id.toString(), true, user._id.toString());

    harness.enqueue(denseLesson);
    harness.enqueue(simpleLesson);
    const turn = await prepareNodeLesson({
      planId: plan._id.toString(),
      userId: user._id.toString(),
      nodeId: node._id.toString(),
      capacityThreshold: 0.65,
      apiKey: "test-key",
    });
    assert.equal(turn.wasRegeneratedForOverload, true);

    harness.enqueue({ mastered: true, feedback: "Correct", hint: null });
    await submitNodeAttempt({
      planId: plan._id.toString(),
      userId: user._id.toString(),
      nodeId: node._id.toString(),
      lesson: turn.lesson,
      wmlAssessment: turn.wmlAssessment,
      userAnswer: "A combined idea",
      attemptCount: 1,
      averageWml: turn.wmlAssessment.totalWml,
      capacityThreshold: turn.wmlAssessment.capacityThreshold,
      apiKey: "test-key",
    });

    assert.equal(await getNextDiagnosticNode(plan._id.toString(), user._id.toString()), null);
    const events = await TelemetryEvent.find({ planId: plan._id }).lean();
    const regenerated = events.find((event) => event.eventType === "lesson_regenerated");
    assert.ok(regenerated);
    assert.equal(regenerated.agent, "learn-agent-system-1");
    assert.equal(regenerated.metrics?.intrinsicLoad, turn.wmlAssessment.intrinsic.score);
    assert.equal(regenerated.metrics?.extrinsicLoad, turn.wmlAssessment.extrinsic.score);
    assert.equal(regenerated.metrics?.capacityThreshold, 0.65);
    assert.equal(regenerated.metrics?.regenerationCount, 1);

    const evaluated = events.find((event) => event.eventType === "attempt_evaluated");
    assert.ok(evaluated);
    assert.equal(evaluated.agent, "learn-agent-system-2");
    assert.ok(typeof evaluated.metrics?.paasEfficiency === "number");
    assert.equal(evaluated.metrics?.totalWmlScore, turn.wmlAssessment.totalWml);
    assert.equal(evaluated.metadata?.correct, true);

    const diagnostic = events.find((event) => event.eventType === "diagnostic_completed");
    assert.ok(diagnostic);
    assert.equal(diagnostic.metrics?.baselineQuestions, 5);
    assert.equal(diagnostic.metrics?.actualDiagnosticQuestions, 1);
    assert.equal(diagnostic.metrics?.diagnosticQuestionReductionPct, 80);

    const jsonEvents = (await readFile(getTelemetryJsonlPath(), "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as { planId?: string; eventType: string });
    assert.ok(jsonEvents.some((event) => event.planId === plan._id.toString() && event.eventType === "lesson_regenerated"));
    assert.ok(jsonEvents.some((event) => event.planId === plan._id.toString() && event.eventType === "attempt_evaluated"));
    assert.ok(jsonEvents.some((event) => event.planId === plan._id.toString() && event.eventType === "diagnostic_completed"));

    const cappedPlan = await Plan.create({
      userId: user._id,
      topic: "Diagnostic budget cap",
      targetDepth: 6,
      status: "DIAGNOSTIC_IN_PROGRESS",
    });
    const cappedNodes = await PlanNode.create(
      Array.from({ length: 4 }, (_, index) => ({
        planId: cappedPlan._id,
        conceptName: `Capped concept ${index + 1}`,
        bloomLevel: 1,
        status: "PENDING" as const,
        prerequisites: [],
      })),
    );
    const cappedNode = await getNextDiagnosticNode(cappedPlan._id.toString(), user._id.toString());
    assert.ok(cappedNode);
    harness.enqueue({ question: "What is the first concept?", expectedCriteria: "Explain it." });
    await generateDiagnosticQuestion(
      cappedPlan.topic,
      cappedNode.conceptName,
      cappedNode.bloomLevel,
      "test-key",
      { planId: cappedPlan._id.toString(), userId: user._id.toString(), nodeId: cappedNode._id.toString() },
    );
    await PlanNode.updateMany(
      { planId: cappedPlan._id, status: "PENDING" },
      { $set: { status: "IN_PROGRESS" } },
    );
    assert.equal(await getNextDiagnosticNode(cappedPlan._id.toString(), user._id.toString()), null);
    const cappedCompletion = await TelemetryEvent.findOne({
      planId: cappedPlan._id,
      eventType: "diagnostic_completed",
    });
    assert.ok(cappedCompletion);
    assert.equal(cappedCompletion.metrics?.baselineQuestions, cappedNodes.length);
    assert.equal(cappedCompletion.metrics?.actualDiagnosticQuestions, 1);
    assert.equal(cappedCompletion.metrics?.diagnosticQuestionReductionPct, 75);
  },
);

test("TelemetryEvent accepts ObjectId references in its typed schema", async () => {
  const userId = new Types.ObjectId();
  const planId = new Types.ObjectId();
  const event = new TelemetryEvent({
    userId,
    planId,
    agent: "plan-agent",
    eventType: "schema_check",
    metrics: { baselineQuestions: 2 },
  });
  await event.validate();
  assert.equal(event.userId?.toString(), userId.toString());
  assert.equal(event.planId?.toString(), planId.toString());
});
