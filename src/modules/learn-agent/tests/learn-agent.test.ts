import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { getOuterFringe, syncPriorUserMastery } from "../services/outer-fringe.js";
import { prepareNodeLesson, submitNodeAttempt } from "../services/micro-tutor.js";
import type { WmlAssessment } from "../types/wml.js";
import { calculateCognitiveEfficiency } from "../utils/cognitive-efficiency.js";
import { getLearningFringeState, selectOuterFringe } from "../utils/outer-fringe-selector.js";
import {
  calculateExtrinsicLoad,
  calculateIntrinsicLoad,
  evaluateWorkingMemoryLoad,
  preGateIntrinsicLoad,
} from "../utils/wml-calculator.js";

const testWmlAssessment: WmlAssessment = {
  intrinsic: { bloomFactor: 0.2, directPrereqFactor: 0.25, transitiveDepthFactor: 0.125, score: 0.2 },
  extrinsic: { sentenceLengthFactor: 0.1, lexicalDensityFactor: 0.2, codeDensityFactor: 0, novelTermFactor: 0.1, score: 0.12 },
  totalWml: 0.42,
  capacityThreshold: 0.70,
  loadLevel: "OPTIMAL",
  isOverloaded: false,
  scaffoldingDirectives: [],
};

test("Intrinsic pre-gate is deterministic across Bloom levels and learner capacities", () => {
  for (let bloomLevel = 1; bloomLevel <= 6; bloomLevel += 1) {
    for (const capacityThreshold of [0.45, 0.55, 0.70, 0.90]) {
      for (const [directPrerequisiteCount, transitiveAncestorCount] of [[0, 0], [2, 3], [4, 8]]) {
        const result = preGateIntrinsicLoad({
          bloomLevel,
          directPrerequisiteCount,
          transitiveAncestorCount,
          capacityThreshold,
        });
        const intrinsic = calculateIntrinsicLoad(
          bloomLevel,
          directPrerequisiteCount,
          transitiveAncestorCount,
        ).score;
        const weightedIntrinsic = 0.55 * intrinsic;
        const extrinsicBudget = Math.max(0, capacityThreshold - weightedIntrinsic);
        const expectedMode = weightedIntrinsic >= capacityThreshold
          ? "INTRINSIC_OVERLOAD"
          : extrinsicBudget <= 0.25 || weightedIntrinsic >= capacityThreshold * 0.70
            ? "CONSTRAINED"
            : "OPTIMAL";

        assert.equal(result.intrinsicLoad, intrinsic);
        assert.equal(result.weightedIntrinsic, weightedIntrinsic);
        assert.equal(result.extrinsicBudget, extrinsicBudget);
        assert.equal(result.mode, expectedMode);
        assert.equal(
          result.proactiveDirectives.length === 0,
          result.mode === "OPTIMAL",
        );
      }
    }
  }

  const optimal = preGateIntrinsicLoad({ bloomLevel: 1, directPrerequisiteCount: 0, transitiveAncestorCount: 0, capacityThreshold: 0.90 });
  const constrained = preGateIntrinsicLoad({ bloomLevel: 6, directPrerequisiteCount: 4, transitiveAncestorCount: 4, capacityThreshold: 0.70 });
  const overloaded = preGateIntrinsicLoad({ bloomLevel: 6, directPrerequisiteCount: 4, transitiveAncestorCount: 4, capacityThreshold: 0.45 });
  assert.equal(optimal.mode, "OPTIMAL");
  assert.equal(constrained.mode, "CONSTRAINED");
  assert.equal(overloaded.mode, "INTRINSIC_OVERLOAD");
  assert.ok(constrained.proactiveDirectives.some((directive) => directive.includes("14 words")));
  assert.ok(overloaded.proactiveDirectives.some((directive) => directive.includes("atomic intuition chunk")));
});

test("WML calculator scores intrinsic and extrinsic load and produces overload scaffolding", () => {
  const intrinsic = calculateIntrinsicLoad(6, 4, 8);
  assert.equal(intrinsic.score, 1);
  assert.equal(intrinsic.bloomFactor, 1);
  assert.equal(intrinsic.directPrereqFactor, 1);
  assert.equal(intrinsic.transitiveDepthFactor, 1);

  const extrinsic = calculateExtrinsicLoad(
    "A sophisticated explanation introduces unfamiliar terminology and uses {code};",
    ["unfamiliar terminology"],
  );
  assert.ok(extrinsic.score > 0);
  assert.ok(extrinsic.lexicalDensityFactor > 0);
  assert.ok(extrinsic.codeDensityFactor > 0);
  assert.ok(extrinsic.novelTermFactor > 0);

  const shortTerms = calculateExtrinsicLoad("setup and random values", ["Set", "Map", "DOM"]);
  assert.equal(shortTerms.novelTermFactor, 0, "short terms must not match inside longer words");
  const punctuatedTerms = calculateExtrinsicLoad("C++ and Node.js", ["C++", "Node.js"]);
  assert.equal(punctuatedTerms.novelTermFactor, 2 / 3);

  const assessment = evaluateWorkingMemoryLoad({
    bloomLevel: 6,
    directPrerequisiteCount: 4,
    transitiveAncestorCount: 8,
    text: "A short explanation.",
    unmasteredConceptNames: [],
    capacityThreshold: 0.45,
  });
  assert.equal(assessment.isOverloaded, true);
  assert.ok(assessment.scaffoldingDirectives.some((directive) => directive.includes("atomic sub-step")));
  assert.ok(assessment.scaffoldingDirectives.some((directive) => directive.includes("check-for-understanding")));
});

test("Outer Fringe prioritizes in-progress nodes, gates prerequisites, and detects completion", () => {
  const selected = selectOuterFringe([
    { nodeId: "pending-low", conceptName: "A", bloomLevel: 1, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "progress-high", conceptName: "Z", bloomLevel: 5, status: "IN_PROGRESS", prerequisiteIds: [] },
    { nodeId: "tie-z", conceptName: "Zebra", bloomLevel: 2, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "tie-a", conceptName: "Apple", bloomLevel: 2, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "locked", conceptName: "Locked", bloomLevel: 1, status: "PENDING", prerequisiteIds: ["pending-low"] },
  ]);
  assert.equal(selected.nextNodeId, "progress-high");
  assert.deepEqual(selected.unlockedNodes.slice(1, 3).map((node) => node.nodeId), ["pending-low", "tie-a"]);
  assert.equal(selected.unlockedNodes.some((node) => node.nodeId === "locked"), false);
  assert.equal(selected.remainingCount, 5);
  assert.equal(selected.isPlanCompleted, false);

  const completed = selectOuterFringe([
    { nodeId: "passed", conceptName: "Passed", bloomLevel: 1, status: "PASSED_IN_DIAGNOSTIC", prerequisiteIds: [] },
    { nodeId: "mastered", conceptName: "Mastered", bloomLevel: 2, status: "MASTERED", prerequisiteIds: ["passed"] },
  ]);
  assert.equal(completed.isPlanCompleted, true);
  assert.equal(completed.nextNodeId, null);
  assert.equal(completed.remainingCount, 0);
  assert.equal(getLearningFringeState(completed), "COMPLETED");
  assert.equal(
    getLearningFringeState({ isPlanCompleted: false, nextNodeId: null }),
    "BLOCKED",
  );
});

test("System 2 efficiency normalizes Paas scoring, bounds capacity, and preserves durable mastery", () => {
  const firstAttempt = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 1,
    averageWml: 0,
    capacityThreshold: 0.89,
  });
  assert.ok(firstAttempt.efficiencyScore > 0.999999);
  assert.equal(firstAttempt.updatedCapacityThreshold, 0.90);
  assert.equal(firstAttempt.durableMasteryScore, 0.95);

  const struggled = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 3,
    averageWml: 1,
    capacityThreshold: 0.46,
  });
  assert.equal(struggled.updatedCapacityThreshold, 0.45);
  assert.equal(struggled.durableMasteryScore, 0.86);
  assert.ok(struggled.durableMasteryScore >= 0.85);

  const secondAttempt = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 2,
    averageWml: 0.4,
    capacityThreshold: 0.7,
  });
  assert.equal(secondAttempt.durableMasteryScore, 0.90);
});

test("Concept names normalize whitespace and casing for durable mastery keys", async () => {
  assert.equal(normalizeConceptName("  Closures   and   Scope  "), "closures and scope");
  const mastery = new UserMastery({
    userId: new Types.ObjectId().toString(),
    conceptName: "  Closures   and   Scope  ",
    canonicalConceptName: "  Explicit   Canonical   Name ",
    masteryScore: 0.9,
  });
  await mastery.validate();
  assert.equal(mastery.conceptKey, "closures and scope");
  assert.equal(mastery.canonicalConceptName, "explicit canonical name");
});

test(
  "MongoDB reconciles prior mastery case-insensitively and enforces Outer Fringe ownership",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    const userId = new Types.ObjectId().toString();
    const otherUserId = new Types.ObjectId().toString();
    let planId: string | undefined;

    await connectToDatabase();
    t.after(async () => {
      if (planId) {
        await PlanNode.deleteMany({ planId });
        await Plan.deleteOne({ _id: planId });
      }
      await UserMastery.deleteMany({ userId });
      await disconnectFromDatabase();
    });

    const plan = await Plan.create({
      userId,
      topic: "JavaScript arrays",
      targetDepth: 2,
      status: "READY",
    });
    planId = plan._id.toString();
    const node = await PlanNode.create({
      planId: plan._id,
      conceptName: "javascript arrays",
      bloomLevel: 1,
      status: "PENDING",
      prerequisites: [],
    });
    await UserMastery.create({
      userId,
        conceptName: "  JavaScript Arrays  ",
      masteryScore: 0.90,
    });

    assert.equal(await syncPriorUserMastery(planId, userId), 1);
    assert.equal((await PlanNode.findById(node._id))?.status, "MASTERED");

    const closureNodes = await PlanNode.create([
      {
        planId: plan._id,
        conceptName: "Closures",
        bloomLevel: 1,
        status: "IN_PROGRESS",
        prerequisites: [],
      },
      {
        planId: plan._id,
        conceptName: "closures",
        bloomLevel: 1,
        status: "IN_PROGRESS",
        prerequisites: [],
      },
    ]);
    const originalFetch = globalThis.fetch;
    await UserMastery.create({
      userId,
      conceptName: "  CLOSURES  ",
      masteryScore: 0.99,
    });
    globalThis.fetch = async () => new Response(JSON.stringify({
      candidates: [{
        content: { parts: [{ text: JSON.stringify({ mastered: true, feedback: "Correct", hint: null }) }] },
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    try {
      const lesson = {
        explanation: "A closure retains access to its lexical scope.",
        checkQuestion: "What does a closure retain?",
        expectedCriteria: "It retains access to lexical scope.",
      };
      const firstEvaluation = await submitNodeAttempt({
        planId,
        userId,
        nodeId: closureNodes[0]._id.toString(),
        lesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "Its lexical scope",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: 0.70,
        apiKey: "test-key",
      });
      assert.ok(Math.abs(firstEvaluation.updatedCapacityThreshold - 0.66) < 1e-10);
      assert.ok(Math.abs(((await Plan.findById(plan._id))?.capacityThreshold ?? 0) - 0.66) < 1e-10);

      await submitNodeAttempt({
        planId,
        userId,
        nodeId: closureNodes[1]._id.toString(),
        lesson,
        wmlAssessment: testWmlAssessment,
        userAnswer: "Its lexical scope",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: firstEvaluation.updatedCapacityThreshold,
        apiKey: "test-key",
      });

      const prerequisiteNodes = await PlanNode.create(
        Array.from({ length: 4 }, (_, index) => ({
          planId: plan._id,
          conceptName: `Mastered prerequisite ${index + 1}`,
          bloomLevel: 1,
          status: "MASTERED" as const,
          prerequisites: [],
        })),
      );
      const gatedNode = await PlanNode.create({
        planId: plan._id,
        conceptName: "Advanced graph reasoning",
        bloomLevel: 6,
        status: "PENDING",
        prerequisites: prerequisiteNodes.map((prerequisite) => prerequisite._id),
      });
      const optimalNode = await PlanNode.create({
        planId: plan._id,
        conceptName: "Basic recall",
        bloomLevel: 1,
        status: "PENDING",
        prerequisites: [],
      });
      const originalConsoleLog = console.log;
      const fetchEvents: string[] = [];
      const requestBodies: Array<{ contents?: Array<{ parts?: Array<{ text?: string }> }> }> = [];
      globalThis.fetch = async (_input, init) => {
        fetchEvents.push("fetch");
        const requestBody = JSON.parse(String(init?.body)) as typeof requestBodies[number];
        requestBodies.push(requestBody);
        const prompt = requestBody.contents?.[0]?.parts?.[0]?.text ?? "";
        const lesson = prompt.includes("INTRINSIC_OVERLOAD")
          ? { explanation: ".", checkQuestion: "?", expectedCriteria: "." }
          : {
              explanation: "map name value",
              checkQuestion: "name value",
              expectedCriteria: "A name to a value.",
            };
        return new Response(JSON.stringify({
          candidates: [{
            content: { parts: [{ text: JSON.stringify(lesson) }] },
          }],
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      };
      console.log = (...values: unknown[]) => {
        if (String(values[0]).includes("[Learn Agent][System 1 Pre-Gate]")) {
          fetchEvents.push("pre-gate");
        }
      };
      try {
        for (const [nodeId, capacityThreshold, expectedMode, expectedPrompt] of [
          [gatedNode._id.toString(), 0.70, "CONSTRAINED", "14 words"],
          [gatedNode._id.toString(), 0.45, "INTRINSIC_OVERLOAD", "atomic intuition chunk"],
          [optimalNode._id.toString(), 0.90, "OPTIMAL", ""],
        ] as const) {
          const eventStart = fetchEvents.length;
          const requestStart = requestBodies.length;
          const turn = await prepareNodeLesson({
            planId,
            userId,
            nodeId,
            apiKey: "test-key",
            capacityThreshold,
          });
          assert.equal(turn.preGate.mode, expectedMode);
          assert.equal(
            turn.regenerated,
            false,
            `${expectedMode}: extrinsic=${turn.wmlAssessment.extrinsic.score}, budget=${turn.preGate.extrinsicBudget}`,
          );
          assert.deepEqual(fetchEvents.slice(eventStart), ["pre-gate", "fetch"]);
          assert.equal(requestBodies.length - requestStart, 1);
          const prompt = requestBodies[requestStart].contents?.[0]?.parts?.[0]?.text ?? "";
          if (expectedPrompt) assert.ok(prompt.includes(expectedPrompt));
          else {
            assert.ok(prompt.includes("mode=OPTIMAL"));
            assert.ok(prompt.includes("No additional pre-gate restrictions apply."));
            assert.ok(!prompt.includes("Treat this budget as a strict constraint."));
          }
        }
      } finally {
        globalThis.fetch = originalFetch;
        console.log = originalConsoleLog;
      }

      await PlanNode.deleteMany({ planId, conceptName: /^(Mastered prerequisite|Advanced graph reasoning|Basic recall)/ });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const closureMastery = await UserMastery.find({ userId, conceptKey: "closures" });
    assert.equal(closureMastery.length, 1);
    assert.equal(closureMastery[0].conceptKey, "closures");
    assert.equal(closureMastery[0].canonicalConceptName, "closures");
    assert.equal(closureMastery[0].masteryScore, 0.99);

    await assert.rejects(
      getOuterFringe(planId, otherUserId),
      /Plan not found for the authenticated user/,
    );
    await assert.rejects(
      getOuterFringe("invalid-plan-id", userId),
      /valid plan ObjectId/,
    );
  },
);