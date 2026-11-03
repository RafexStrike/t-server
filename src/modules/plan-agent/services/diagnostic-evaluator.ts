import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([node._id.toString()]);
  const pendingIds: string[] = [];

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): void {
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING") {
        pendingIds.push(prerequisiteKey);
      }
      visit(prerequisite.prerequisites);
    }
  }

  visit(node.prerequisites);
  return pendingIds;
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([nodeId]);
  const pendingIds: string[] = [];

  function visit(parentId: string): void {
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (!child) {
        continue;
      }
      if (child.status === "PENDING") {
        pendingIds.push(childId);
      }
      visit(childId);
    }
  }

  visit(nodeId);
  return pendingIds;
}

/** Applies a diagnostic result and invalidates dependent knowledge assumptions. */
export async function processDiagnosticAnswer(
  nodeId: string,
  passed: boolean,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(nodeId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid PlanNode and authenticated user ObjectIds are required.");
  }

  const node = await PlanNode.findById(nodeId);
  if (!node) {
    throw new Error(`PlanNode not found: ${nodeId}`);
  }
  if (!(await Plan.exists({ _id: node.planId, userId }))) {
    throw new Error("PlanNode is not owned by the authenticated user.");
  }
  console.log(`[Plan Agent] Verified diagnostic answer owner ${userId} for node ${nodeId}.`);

  const allNodes = await PlanNode.find({ planId: node.planId });
  const nodesById = new Map(
    allNodes.map((planNode) => [planNode._id.toString(), planNode] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const planNode of allNodes) {
    for (const prerequisiteId of planNode.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(planNode._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  const affectedNodeIds = passed
    ? collectPendingAncestors(node, nodesById)
    : collectPendingDescendants(node._id.toString(), childrenById, nodesById);
  const nextStatus = passed ? "PASSED_IN_DIAGNOSTIC" : "IN_PROGRESS";

  node.status = nextStatus;
  await node.save();

  if (affectedNodeIds.length > 0) {
    await PlanNode.updateMany(
      {
        _id: { $in: affectedNodeIds },
        planId: node.planId,
        status: "PENDING",
      },
      { $set: { status: nextStatus } },
    );
  }

  console.log(
    `[Plan Agent] Diagnostic answer ${passed ? "passed" : "failed"} for "${node.conceptName}"; updated ${affectedNodeIds.length} ${passed ? "pending ancestors" : "pending descendants"} to ${nextStatus}.`,
  );
}