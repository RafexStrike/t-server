import assert from "node:assert/strict";
import test from "node:test";
import { breakPrerequisiteCycles, pruneGraph, pruneGraphWithStats } from "../utils/graph-pruner.js";
import type { RawGraphNode } from "../types/graph.js";

function assertRootReachableDag(nodes: RawGraphNode[]): void {
  const dependents = new Map<string, string[]>();
  const prerequisiteCounts = new Map<string, number>();
  for (const node of nodes) {
    prerequisiteCounts.set(node.conceptName, node.prerequisiteNames.length);
    for (const prerequisiteName of node.prerequisiteNames) {
      const current = dependents.get(prerequisiteName) ?? [];
      current.push(node.conceptName);
      dependents.set(prerequisiteName, current);
    }
  }

  const queue = nodes
    .filter((node) => node.prerequisiteNames.length === 0)
    .map((node) => node.conceptName);
  const visited = new Set<string>();
  while (queue.length > 0) {
    const conceptName = queue.shift()!;
    if (visited.has(conceptName)) continue;
    visited.add(conceptName);
    for (const dependent of dependents.get(conceptName) ?? []) {
      const remaining = (prerequisiteCounts.get(dependent) ?? 0) - 1;
      prerequisiteCounts.set(dependent, remaining);
      if (remaining === 0) queue.push(dependent);
    }
  }
  assert.equal(visited.size, nodes.length);
}

test("pruneGraph breaks reachable prerequisite cycles before returning nodes", () => {
  const result = pruneGraph([
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
    { conceptName: "Goal", bloomLevel: 3, prerequisiteNames: ["A"] },
  ], 3);

  assertRootReachableDag(result);
  assert.deepEqual(result.map((node) => node.prerequisiteNames), [["B"], [], ["A"]]);
});

test("pruneGraph deduplicates normalized concepts and rewrites prerequisite aliases", () => {
  const result = pruneGraph([
    { conceptName: "Core   Concept", bloomLevel: 1, prerequisiteNames: [] },
    { conceptName: "core concept", bloomLevel: 1, prerequisiteNames: [] },
    { conceptName: "Goal", bloomLevel: 2, prerequisiteNames: [" CORE CONCEPT "] },
  ], 2);

  assert.equal(result.length, 2);
  assert.deepEqual(result.map((node) => node.conceptName), ["Core   Concept", "Goal"]);
  assert.deepEqual(result[1].prerequisiteNames, ["Core   Concept"]);
  assertRootReachableDag(result);
});

test("pruneGraphWithStats reports duplicate, cycle, depth, and unreachable removals", () => {
  const { nodes, stats } = pruneGraphWithStats([
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
    { conceptName: "Goal", bloomLevel: 3, prerequisiteNames: ["A"] },
    { conceptName: " a ", bloomLevel: 1, prerequisiteNames: [] },
    { conceptName: "Cycle X", bloomLevel: 1, prerequisiteNames: ["Cycle Y"] },
    { conceptName: "Cycle Y", bloomLevel: 2, prerequisiteNames: ["Cycle X"] },
    { conceptName: "Too deep", bloomLevel: 6, prerequisiteNames: [] },
  ], 3);

  assert.equal(nodes.length, 3);
  assert.deepEqual(stats, {
    rawNodeCount: 7,
    prunedNodeCount: 3,
    duplicateNodeCount: 1,
    cycleEdgesRemoved: 1,
    depthFilteredNodeCount: 1,
    unreachableNodeCount: 2,
  });
});

test("breakPrerequisiteCycles turns two-node cycles into root-reachable DAGs", () => {
  const input: RawGraphNode[] = [
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
  ];
  const result = breakPrerequisiteCycles(input);

  assertRootReachableDag(result);
  assert.deepEqual(result.map((node) => node.prerequisiteNames), [["B"], []]);
  assert.deepEqual(input.map((node) => node.prerequisiteNames), [["B"], ["A"]]);
});

test("breakPrerequisiteCycles deterministically breaks three-node cycles", () => {
  const input: RawGraphNode[] = [
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["C"] },
    { conceptName: "C", bloomLevel: 3, prerequisiteNames: ["A"] },
  ];

  const first = breakPrerequisiteCycles(input);
  const second = breakPrerequisiteCycles(input);
  assertRootReachableDag(first);
  assert.deepEqual(first, second);
  assert.deepEqual(first.map((node) => node.prerequisiteNames), [["B"], ["C"], []]);
});