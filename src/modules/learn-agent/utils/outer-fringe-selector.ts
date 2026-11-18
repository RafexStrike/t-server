import type { OuterFringeResult } from "../types/wml.js";

export const KNOWLEDGE_FRONTIER_SATISFIED = new Set([
  "PASSED_IN_DIAGNOSTIC",
  "MASTERED",
]);

export interface OuterFringeNode {
  nodeId: string;
  conceptName: string;
  bloomLevel: number;
  status: string;
  prerequisiteIds: string[];
}

export type LearningFringeState = "COMPLETED" | "BLOCKED" | "READY";

export function getLearningFringeState(
  fringe: Pick<OuterFringeResult, "isPlanCompleted" | "nextNodeId">,
): LearningFringeState {
  if (fringe.isPlanCompleted) return "COMPLETED";
  if (!fringe.nextNodeId) return "BLOCKED";
  return "READY";
}

export function selectOuterFringe(
  nodes: OuterFringeNode[],
  satisfiedStatuses: ReadonlySet<string> = KNOWLEDGE_FRONTIER_SATISFIED,
): OuterFringeResult {
  const nodeStatusById = new Map(
    nodes.map((node) => [node.nodeId, node.status] as const),
  );
  const unlockedNodes = nodes
    .filter(
      (node) =>
        (node.status === "IN_PROGRESS" || node.status === "PENDING" || node.status === "QUEUED") &&
        node.prerequisiteIds.every((prerequisiteId) =>
          satisfiedStatuses.has(nodeStatusById.get(prerequisiteId) ?? ""),
        ),
    )
    .sort((left, right) => {
      const statusOrder =
        Number(right.status === "IN_PROGRESS") -
        Number(left.status === "IN_PROGRESS");
      return (
        statusOrder ||
        left.bloomLevel - right.bloomLevel ||
        (left.conceptName < right.conceptName
          ? -1
          : left.conceptName > right.conceptName
            ? 1
            : 0)
      );
    })
    .map((node) => ({
      nodeId: node.nodeId,
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: node.status,
      prerequisiteCount: node.prerequisiteIds.length,
    }));

  const remainingCount = nodes.filter(
    (node) => !satisfiedStatuses.has(node.status),
  ).length;
  const isPlanCompleted = remainingCount === 0;

  return {
    unlockedNodes,
    nextNodeId: unlockedNodes[0]?.nodeId ?? null,
    remainingCount,
    isPlanCompleted,
  };
}

export function countTransitiveAncestors(
  nodeId: string,
  nodes: OuterFringeNode[],
): number {
  const nodesById = new Map(nodes.map((node) => [node.nodeId, node] as const));
  const visited = new Set<string>([nodeId]);

  function visit(current: OuterFringeNode): void {
    for (const prerequisiteId of current.prerequisiteIds) {
      if (visited.has(prerequisiteId)) continue;
      visited.add(prerequisiteId);
      const prerequisite = nodesById.get(prerequisiteId);
      if (prerequisite) visit(prerequisite);
    }
  }

  const node = nodesById.get(nodeId);
  if (node) visit(node);
  return visited.size - 1;
}