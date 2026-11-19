import type { RawGraphNode } from "../types/graph.js";

function normalizedConceptKey(conceptName: string): string {
  return conceptName.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Retains the new learning outcomes at the requested Bloom depth and exactly
 * the prerequisite ancestors needed to reach those outcomes.
 */
export function pruneGraph(
  rawGraph: RawGraphNode[],
  targetDepth: number,
): RawGraphNode[] {
  return pruneGraphWithStats(rawGraph, targetDepth).nodes;
}

export function pruneGraphWithStats(
  rawGraph: RawGraphNode[],
  targetDepth: number,
): {
  nodes: RawGraphNode[];
  stats: {
    rawNodeCount: number;
    prunedNodeCount: number;
    duplicateNodeCount: number;
    cycleEdgesRemoved: number;
    depthFilteredNodeCount: number;
    unreachableNodeCount: number;
  };
} {
  const depthEligibleNodes = rawGraph.filter(
    (node) => node.bloomLevel <= targetDepth,
  );
  const uniqueNodesByKey = new Map<string, RawGraphNode>();
  for (const node of depthEligibleNodes) {
    const key = normalizedConceptKey(node.conceptName);
    if (!uniqueNodesByKey.has(key)) uniqueNodesByKey.set(key, node);
  }
  const canonicalNamesByKey = new Map(
    [...uniqueNodesByKey].map(([key, node]) => [key, node.conceptName]),
  );
  const filteredNodes = [...uniqueNodesByKey.values()].map((node) => ({
    ...node,
    prerequisiteNames: node.prerequisiteNames.map(
      (name) => canonicalNamesByKey.get(normalizedConceptKey(name)) ?? name,
    ),
  }));
  const knownNames = new Set(filteredNodes.map((node) => node.conceptName));
  const connectedFilteredNodes = filteredNodes.filter((node) =>
    node.prerequisiteNames.every((name) => knownNames.has(name)),
  );
  const acyclicFilteredNodes = breakPrerequisiteCycles(connectedFilteredNodes);
  const nodesByName = new Map(
    acyclicFilteredNodes.map((node) => [node.conceptName, node]),
  );

  // A node referenced as a prerequisite has a dependent above it, so it is
  // not a finish line. The remaining nodes are sinks in the filtered graph.
  const prerequisiteNames = new Set(
    acyclicFilteredNodes.flatMap((node) => node.prerequisiteNames),
  );
  const targetSinks = acyclicFilteredNodes.filter(
    (node) => !prerequisiteNames.has(node.conceptName),
  );

  // Walking prerequisite edges backward from each sink yields its ancestral
  // subgraph; the visited set both deduplicates shared ancestors and stops
  // repeated traversal if malformed input contains a cycle.
  const requiredNames = new Set<string>();
  const visitingNames = new Set<string>();
  const visitAncestors = (conceptName: string): boolean => {
    if (requiredNames.has(conceptName)) {
      return true;
    }
    if (visitingNames.has(conceptName)) {
      return true;
    }

    const node = nodesByName.get(conceptName);
    if (!node) {
      return false;
    }

    visitingNames.add(conceptName);
    for (const prerequisiteName of node.prerequisiteNames) {
      if (!visitAncestors(prerequisiteName)) {
        visitingNames.delete(conceptName);
        return false;
      }
    }
    visitingNames.delete(conceptName);
    requiredNames.add(conceptName);
    return true;
  };

  for (const sink of targetSinks) {
    visitAncestors(sink.conceptName);
  }

  const reachableNodes = acyclicFilteredNodes.filter((node) =>
    requiredNames.has(node.conceptName),
  );
  const nodes = breakPrerequisiteCycles(reachableNodes);
  const edgeCount = (graph: RawGraphNode[]) =>
    graph.reduce((count, node) => count + node.prerequisiteNames.length, 0);

  const reachableCycleEdgesRemoved = reachableNodes.reduce((total, node) => {
    const original = connectedFilteredNodes.find((candidate) => candidate.conceptName === node.conceptName);
    const originalPrerequisites = new Set(original?.prerequisiteNames ?? []);
    const retainedPrerequisites = new Set(node.prerequisiteNames);
    return total + [...originalPrerequisites].filter((name) => !retainedPrerequisites.has(name)).length;
  }, 0);

  return {
    nodes,
    stats: {
      rawNodeCount: rawGraph.length,
      prunedNodeCount: nodes.length,
      duplicateNodeCount: depthEligibleNodes.length - uniqueNodesByKey.size,
      cycleEdgesRemoved: reachableCycleEdgesRemoved,
      depthFilteredNodeCount: rawGraph.length - depthEligibleNodes.length,
      unreachableNodeCount: acyclicFilteredNodes.length - reachableNodes.length,
    },
  };
}

/** Breaks prerequisite back-edges deterministically and verifies the result. */
export function breakPrerequisiteCycles(nodes: RawGraphNode[]): RawGraphNode[] {
  const graph = nodes.map((node) => ({
    ...node,
    prerequisiteNames: [...node.prerequisiteNames],
  }));
  const nodesByName = new Map(graph.map((node) => [node.conceptName, node]));
  for (const node of graph) {
    node.prerequisiteNames = node.prerequisiteNames.filter((name) => nodesByName.has(name));
  }
  const orderedNodes = [...graph].sort(
    (left, right) => left.bloomLevel - right.bloomLevel || left.conceptName.localeCompare(right.conceptName),
  );
  const state = new Map<string, "visiting" | "visited">();

  const visit = (node: RawGraphNode): void => {
    state.set(node.conceptName, "visiting");
    const orderedPrerequisites = [...node.prerequisiteNames].sort((leftName, rightName) => {
      const left = nodesByName.get(leftName);
      const right = nodesByName.get(rightName);
      return (left?.bloomLevel ?? Number.MAX_SAFE_INTEGER)
        - (right?.bloomLevel ?? Number.MAX_SAFE_INTEGER)
        || leftName.localeCompare(rightName);
    });

    for (const prerequisiteName of orderedPrerequisites) {
      if (state.get(prerequisiteName) === "visiting") {
        node.prerequisiteNames = node.prerequisiteNames.filter(
          (name) => name !== prerequisiteName,
        );
        continue;
      }
      const prerequisite = nodesByName.get(prerequisiteName);
      if (prerequisite && state.get(prerequisiteName) !== "visited") visit(prerequisite);
    }
    state.set(node.conceptName, "visited");
  };

  for (const node of orderedNodes) {
    if (!state.has(node.conceptName)) visit(node);
  }

  const dependents = new Map<string, string[]>();
  const unresolvedPrerequisiteCounts = new Map<string, number>();
  for (const node of graph) {
    unresolvedPrerequisiteCounts.set(node.conceptName, node.prerequisiteNames.length);
    for (const prerequisiteName of node.prerequisiteNames) {
      const currentDependents = dependents.get(prerequisiteName) ?? [];
      currentDependents.push(node.conceptName);
      dependents.set(prerequisiteName, currentDependents);
    }
  }

  const roots = graph
    .filter((node) => node.prerequisiteNames.length === 0)
    .map((node) => node.conceptName)
    .sort();
  const queue = [...roots];
  const reachable = new Set<string>();
  let processedCount = 0;
  while (queue.length > 0) {
    const conceptName = queue.shift()!;
    if (reachable.has(conceptName)) continue;
    reachable.add(conceptName);
    processedCount += 1;
    for (const dependentName of dependents.get(conceptName) ?? []) {
      const remaining = (unresolvedPrerequisiteCounts.get(dependentName) ?? 0) - 1;
      unresolvedPrerequisiteCounts.set(dependentName, remaining);
      if (remaining === 0) queue.push(dependentName);
    }
  }

  if (processedCount !== graph.length || reachable.size !== graph.length) {
    throw new Error("Prerequisite cycle breaking failed to produce a root-reachable DAG.");
  }
  return graph;
}