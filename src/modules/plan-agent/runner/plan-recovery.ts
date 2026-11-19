import { PlanNode } from "../models/PlanNode.js";
import { Plan } from "../models/Plan.js";
import { UserMastery } from "../models/UserMastery.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { PRIOR_MASTERY_THRESHOLD } from "../../learn-agent/services/outer-fringe.js";
import { selectBacktrackPrerequisite } from "../../learn-agent/utils/outer-fringe-selector.js";

export async function reopenBacktrackPrerequisite(
  planId: string,
  currentNodeId: string,
) {
  const currentNode = await PlanNode.findOne({ _id: currentNodeId, planId });
  if (!currentNode) return undefined;
  const plan = await Plan.findById(planId).select("userId");
  if (!plan) return undefined;

  const prerequisites = await PlanNode.find({
    _id: { $in: currentNode.prerequisites },
    planId,
    status: { $in: ["PASSED_IN_DIAGNOSTIC", "MASTERED"] },
  });
  const target = selectBacktrackPrerequisite(prerequisites.map((node) => ({
    nodeId: node._id.toString(),
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    status: node.status,
    prerequisiteIds: node.prerequisites.map((id) => id.toString()),
  })));
  if (!target) return undefined;

  await PlanNode.updateOne(
    { _id: target.nodeId, planId },
    { $set: { status: "PENDING" } },
  );
  await UserMastery.updateOne(
    {
      userId: plan.userId.toString(),
      conceptKey: normalizeConceptName(target.conceptName),
      masteryScore: { $gte: PRIOR_MASTERY_THRESHOLD },
    },
    { $set: { masteryScore: PRIOR_MASTERY_THRESHOLD - 0.01 } },
  );
  await PlanNode.updateOne(
    { _id: currentNodeId, planId },
    { $set: { status: "QUEUED" } },
  );
  return target;
}