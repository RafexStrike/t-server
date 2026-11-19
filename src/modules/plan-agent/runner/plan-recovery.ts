import { PlanNode } from "../models/PlanNode.js";
import { selectBacktrackPrerequisite } from "../../learn-agent/utils/outer-fringe-selector.js";

export async function reopenBacktrackPrerequisite(
  planId: string,
  currentNodeId: string,
) {
  const currentNode = await PlanNode.findOne({ _id: currentNodeId, planId });
  if (!currentNode) return undefined;

  const prerequisites = await PlanNode.find({
    _id: { $in: currentNode.prerequisites },
    planId,
    status: "PASSED_IN_DIAGNOSTIC",
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
  await PlanNode.updateOne(
    { _id: currentNodeId, planId },
    { $set: { status: "QUEUED" } },
  );
  return target;
}