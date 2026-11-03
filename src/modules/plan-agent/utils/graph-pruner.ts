import type { RawGraphNode } from "../types/graph.js";

/**
 * Retains the new learning outcomes at the requested Bloom depth and exactly
 * the prerequisite ancestors needed to reach those outcomes.
 */
export function pruneGraph(
  rawGraph: RawGraphNode[],
  targetDepth: number,
): RawGraphNode[] {
  const filteredNodes = rawGraph.filter((node) => node.bloomLevel <= targetDepth);
  const nodesByName = new Map(
    filteredNodes.map((node) => [node.conceptName, node]),
  );

  // A node referenced as a prerequisite has a dependent above it, so it is
  // not a finish line. The remaining nodes are sinks in the filtered graph.
  const prerequisiteNames = new Set(
    filteredNodes.flatMap((node) => node.prerequisiteNames),
  );
  const targetSinks = filteredNodes.filter(
    (node) => !prerequisiteNames.has(node.conceptName),
  );

  // Walking prerequisite edges backward from each sink yields its ancestral
  // subgraph; the visited set both deduplicates shared ancestors and stops
  // repeated traversal if malformed input contains a cycle.
  const requiredNames = new Set<string>();
  const visitAncestors = (conceptName: string): void => {
    if (requiredNames.has(conceptName)) {
      return;
    }

    const node = nodesByName.get(conceptName);
    if (!node) {
      return;
    }

    requiredNames.add(conceptName);
    for (const prerequisiteName of node.prerequisiteNames) {
      visitAncestors(prerequisiteName);
    }
  };

  for (const sink of targetSinks) {
    visitAncestors(sink.conceptName);
  }

  return filteredNodes.filter((node) => requiredNames.has(node.conceptName));
}