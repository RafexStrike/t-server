import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { getOuterFringe, syncPriorUserMastery } from "../services/outer-fringe.js";
import { calculateCognitiveEfficiency } from "../utils/cognitive-efficiency.js";
import { selectOuterFringe } from "../utils/outer-fringe-selector.js";
import {
  calculateExtrinsicLoad,
  calculateIntrinsicLoad,
  evaluateWorkingMemoryLoad,
} from "../utils/wml-calculator.js";

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
      conceptName: "JavaScript Arrays",
      masteryScore: 0.90,
    });

    assert.equal(await syncPriorUserMastery(planId, userId), 1);
    assert.equal((await PlanNode.findById(node._id))?.status, "MASTERED");
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