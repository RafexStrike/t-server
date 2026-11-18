import { Types } from "mongoose";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import type { OuterFringeResult } from "../types/wml.js";
import {
  KNOWLEDGE_FRONTIER_SATISFIED,
  selectOuterFringe,
} from "../utils/outer-fringe-selector.js";

export { KNOWLEDGE_FRONTIER_SATISFIED };
export const PRIOR_MASTERY_THRESHOLD = 0.85;

export async function syncPriorUserMastery(
  planId: string,
  userId: string,
): Promise<number> {
  if (!Types.ObjectId.isValid(planId)) {
    throw new Error("A valid plan ObjectId is required for prior mastery reconciliation.");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required for prior mastery reconciliation.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  const unresolvedNodes = await PlanNode.find({
    planId,
    status: { $in: ["PENDING", "QUEUED", "IN_PROGRESS"] },
  });
  if (unresolvedNodes.length === 0) return 0;

  const priorMastery = await UserMastery.find({
    userId,
    conceptKey: {
      $in: unresolvedNodes.map((node) => normalizeConceptName(node.conceptName)),
    },
    masteryScore: { $gte: PRIOR_MASTERY_THRESHOLD },
  }).select("conceptKey");
  if (priorMastery.length === 0) {
    console.log(
      `[Learn Agent][KST] Prior mastery reconciliation: 0 nodes auto-credited for plan ${planId}.`,
    );
    return 0;
  }

  const masteredConceptNames = new Set(
    priorMastery.map((mastery) => normalizeConceptName(mastery.conceptKey)),
  );
  const matchingNodeIds = unresolvedNodes
    .filter((node) => masteredConceptNames.has(normalizeConceptName(node.conceptName)))
    .map((node) => node._id);
  if (matchingNodeIds.length === 0) return 0;
  const result = await PlanNode.updateMany(
    {
      planId,
      _id: { $in: matchingNodeIds },
      status: { $in: ["PENDING", "QUEUED", "IN_PROGRESS"] },
    },
    { $set: { status: "MASTERED" } },
  );
  const updatedCount = result.modifiedCount;
  console.log(
    `[Learn Agent][KST] Prior mastery reconciliation: ${updatedCount} nodes auto-credited from durable UserMastery for plan ${planId}.`,
  );
  return updatedCount;
}

export async function getOuterFringe(
  planId: string,
  userId: string,
): Promise<OuterFringeResult> {
  if (!Types.ObjectId.isValid(planId)) {
    throw new Error("A valid plan ObjectId is required to load the Outer Fringe.");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to load the Outer Fringe.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  await syncPriorUserMastery(planId, userId);
  const nodes = await PlanNode.find({ planId });
  const result = selectOuterFringe(
    nodes.map((node) => ({
      nodeId: node._id.toString(),
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: node.status,
      prerequisiteIds: node.prerequisites.map((id) => id.toString()),
    })),
    KNOWLEDGE_FRONTIER_SATISFIED,
  );
  if (result.isPlanCompleted) {
    await Plan.updateOne(
      { _id: planId, userId },
      { $set: { status: "COMPLETED" } },
    );
  }

  console.log(
    `[Learn Agent][KST] Outer Fringe size=${result.unlockedNodes.length} | Candidates=${result.unlockedNodes.map((node) => `${node.conceptName}:${node.status}`).join(", ") || "none"} | nextNodeId=${result.nextNodeId ?? "none"} | remaining=${result.remainingCount} | completed=${result.isPlanCompleted}.`,
  );

  return result;
}