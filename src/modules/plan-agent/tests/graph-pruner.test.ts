import assert from "node:assert/strict";
import test from "node:test";
import { breakPrerequisiteCycles } from "../utils/graph-pruner.js";
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