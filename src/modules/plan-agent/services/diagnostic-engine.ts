import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([node._id.toString()]);

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): number {
    let count = 0;
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
        count += 1;
      }
      count += visit(prerequisite.prerequisites);
    }
    return count;
  }

  return visit(node.prerequisites);
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([nodeId]);

  function visit(parentId: string): number {
    let count = 0;
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (child?.status === "PENDING") {
        count += 1;
      }
      count += visit(childId);
    }
    return count;
  }

  return visit(nodeId);
}

/** Selects the pending node whose known/unknown closure sizes are most balanced. */
export async function getNextDiagnosticNode(
  planId: string,
): Promise<PlanNodeDocument | null> {
  const pendingNodes = await PlanNode.find({ planId, status: "PENDING" }).sort({
    conceptName: 1,
  });

  if (pendingNodes.length === 0) {
    console.log(`[Plan Agent] Diagnostic complete for plan ${planId}: no pending nodes.`);
    return null;
  }

  const allNodes = await PlanNode.find({ planId });
  const nodesById = new Map(
    allNodes.map((node) => [node._id.toString(), node] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const node of allNodes) {
    for (const prerequisiteId of node.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(node._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  let selectedNode: PlanNodeDocument | null = null;
  let lowestScore = Number.POSITIVE_INFINITY;

  for (const node of pendingNodes) {
    const pendingAncestors = collectPendingAncestors(node, nodesById);
    const pendingDescendants = collectPendingDescendants(
      node._id.toString(),
      childrenById,
      nodesById,
    );
    const informationScore = Math.abs(pendingAncestors - pendingDescendants);

    console.log(
      `[Plan Agent] Diagnostic information score: "${node.conceptName}"; pendingAncestors=${pendingAncestors}; pendingDescendants=${pendingDescendants}; score=${informationScore}.`,
    );

    if (informationScore < lowestScore) {
      lowestScore = informationScore;
      selectedNode = node;
    }
  }

  console.log(
    `[Plan Agent] Selected diagnostic node: "${selectedNode?.conceptName ?? "none"}" (score=${lowestScore}).`,
  );
  return selectedNode;
}