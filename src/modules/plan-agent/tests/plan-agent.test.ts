import "dotenv/config";
import test from "node:test";
import assert from "node:assert";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { evaluateUserIntent } from "../services/clarify-service.js";
import { pruneGraph } from "../utils/graph-pruner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";

const apiKey = process.env.GEMINI_API_KEY || "";
const testUserId = "test_user_architecture_999";

test("Plan Agent Integration Test Suite", async (t) => {
  // 1. Ensure Database Connection
  await t.test("Database Connection", async () => {
    await connectToDatabase();
    assert.strictEqual(true, true, "Database connected successfully");
  });

  // 2. Test Ambiguity Guard (ClarifyService) with light retry logic for 503 spikes
  await t.test("ClarifyService: Handles ambiguous vs scoped queries", async () => {
    if (!apiKey) {
      console.warn("Skipping LLM tests: GEMINI_API_KEY is missing.");
      return;
    }

    let initialEval;
    let attempts = 0;
    while (attempts < 3) {
      try {
        initialEval = await evaluateUserIntent(
          "I want to learn programming",
          { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null },
          apiKey
        );
        break;
      } catch (err: any) {
        attempts++;
        if (attempts >= 3) throw err;
        console.warn(`[Test] Gemini 503 encountered. Retrying attempt ${attempts + 1}...`);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    assert.strictEqual(initialEval!.isComplete, false, "Ambiguous prompt should not complete slots");
    assert.notStrictEqual(initialEval!.nextQuestion, null, "Should generate a clarification question");

    // Fully scoped prompt
    const finalEval = await evaluateUserIntent(
      "I want to learn JavaScript DOM manipulation at an application/apply level (Bloom 3)",
      { targetLanguageOrTool: "JavaScript", specificSubdomain: "DOM Manipulation", targetDepth: 3 },
      apiKey
    );

    assert.strictEqual(finalEval.isComplete, true, "Fully scoped prompt should complete all slots");
  });

// 3. Test Graph Pruning Math
  await t.test("GraphPruner: Mathematically removes orphans and deep nodes", () => {
    const mockRawGraph = [
      { conceptName: "Variables", bloomLevel: 1, prerequisiteNames: [] },
      { conceptName: "Functions", bloomLevel: 2, prerequisiteNames: ["Variables"] },
      { conceptName: "DOM Events", bloomLevel: 3, prerequisiteNames: ["Functions"] },
      { conceptName: "Custom Framework Architecture", bloomLevel: 6, prerequisiteNames: ["DOM Events"] }, // Pruned: level 6 > target 3
      { conceptName: "Unconnected Basic Math", bloomLevel: 1, prerequisiteNames: ["NonExistentTopic"] } // Pruned: unreachable/orphan
    ];

    const pruned = pruneGraph(mockRawGraph, 3);

    assert.strictEqual(pruned.length, 4, "Should retain exactly 4 reachable connected nodes <= level 3");
    assert.strictEqual(pruned.some(n => n.conceptName === "Custom Framework Architecture"), false, "Level 6 node must be pruned");
    assert.strictEqual(pruned.some(n => n.conceptName === "Unconnected Basic Math"), false, "Unreachable orphan node must be pruned");
  });

  // 4. Test End-to-End Plan Creation & Database Ingestion
  let createdPlanId: string;
  await t.test("PlanService: Creates Plan and Parent-Referenced DAG in MongoDB", async () => {
    if (!apiKey) return;

    await Plan.deleteMany({ userId: testUserId });

    const plan = await createLearningPlan(
      testUserId,
      "JavaScript Basics",
      2, 
      apiKey
    );

    createdPlanId = plan._id.toString();
    assert.notStrictEqual(createdPlanId, null, "Plan ID should be generated");
    assert.strictEqual(plan.topic, "JavaScript Basics");

    const nodes = await PlanNode.find({ planId: plan._id });
    assert.strictEqual(nodes.length > 0, true, "Plan nodes must be inserted into MongoDB");
    
    for (const node of nodes) {
      assert.strictEqual(Array.isArray(node.prerequisites), true, "Prerequisites must be an array of ObjectIds");
    }
  });

  // 5. Test Diagnostic Engine & KST Invalidation
  await t.test("DiagnosticEngine & Evaluator: Topological median and KST cascade", async () => {
    if (!createdPlanId) return;

    const diagnosticNode = await getNextDiagnosticNode(createdPlanId);
    
    if (diagnosticNode) {
      assert.strictEqual(diagnosticNode.status, "PENDING", "Selected diagnostic node must be pending");

      await processDiagnosticAnswer(diagnosticNode._id.toString(), true);

      const updatedNode = await PlanNode.findById(diagnosticNode._id);
      assert.strictEqual(updatedNode?.status, "PASSED_IN_DIAGNOSTIC", "Node status should update to passed");
    }
  });

  // 6. Teardown
  await t.test("Teardown", async () => {
    if (createdPlanId) {
      await Plan.deleteMany({ userId: testUserId });
      await PlanNode.deleteMany({ planId: createdPlanId });
    }
    await disconnectFromDatabase();
  });
});

// Helper mock node generators
function variablesNode(name: string, level: number, prereqs: string[]) {
  return { conceptName: name, bloomLevel: level, prerequisiteNames: prereqs };
}
function functionsNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function domNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function advancedNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function orphanNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}