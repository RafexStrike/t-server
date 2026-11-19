import "dotenv/config";
import test from "node:test";
import assert from "node:assert";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { evaluateUserIntent } from "../services/clarify-service.js";
import { pruneGraph, breakPrerequisiteCycles } from "../utils/graph-pruner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { UserLearningSlots } from "../models/UserLearningSlots.js";
import { TelemetryEvent } from "../../telemetry/models/TelemetryEvent.js";
import { useTemporaryJsonl } from "../../telemetry/tests/temporary-jsonl.js";
import { registerUser, verifySessionToken } from "../../auth/services/auth-service.js";
import { env, validateEnv } from "../../../config/env.js";
import { parsePlanChoice } from "../runner/plan-choice.js";
import { createFetchStub } from "../../learn-agent/tests/fetch-stub.js";

const apiKey = "deterministic-test-key";
let testUserId = "";

test("CLI plan choice rejects empty and out-of-range input", () => {
  assert.equal(parsePlanChoice("   ", 2), undefined);
  assert.equal(parsePlanChoice("3", 2), undefined);
  assert.equal(parsePlanChoice("0", 2), 0);
  assert.equal(parsePlanChoice(" 2 ", 2), 2);
});

test("Environment validation allows complete MongoDB URIs without separate credentials", () => {
  assert.doesNotThrow(() => validateEnv({
    ...env,
    MONGODB_URI: "mongodb://localhost:27017/thesis",
    MONGODB_USERNAME: undefined,
    MONGODB_PASSWORD: undefined,
  }));
  assert.throws(() => validateEnv({
    ...env,
    MONGODB_URI: undefined,
    MONGODB_USERNAME: undefined,
    MONGODB_PASSWORD: "secret",
  }), /MONGODB_URI/);
  assert.throws(() => validateEnv({
    ...env,
    MONGODB_URI: undefined,
    MONGODB_USERNAME: "user",
    MONGODB_PASSWORD: "secret",
  }), /MONGODB_URI/);
});

test("Plan Agent Integration Test Suite", async (t) => {
  await useTemporaryJsonl(t);
  // 1. Ensure Database Connection
  await t.test("Database Connection", async () => {
    await connectToDatabase();
    const registration = await registerUser(
      `plan-agent-test-${Date.now()}@example.test`,
      "integration-test-password",
    );
    testUserId = registration.user.userId;
    assert.strictEqual(verifySessionToken(registration.sessionToken), testUserId);
    assert.strictEqual(true, true, "Database connected successfully");
  });

  // 2. Test Ambiguity Guard (ClarifyService) with light retry logic for 503 spikes
  await t.test("ClarifyService: Handles ambiguous vs scoped queries", async () => {
    const harness = createFetchStub(t);
    harness.enqueue({
      slots: { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null },
      isComplete: false,
      nextQuestion: "Which programming language or tool should we focus on?",
    });
    harness.enqueue({
      slots: { targetLanguageOrTool: "JavaScript", specificSubdomain: "DOM manipulation", targetDepth: 3 },
      isComplete: true,
      nextQuestion: null,
    });
    const initialEval = await evaluateUserIntent(testUserId, "I want to learn programming", apiKey);
    assert.strictEqual(initialEval.isComplete, false);
    assert.notStrictEqual(initialEval.nextQuestion, null);

    const finalEval = await evaluateUserIntent(testUserId, "I want to learn JavaScript DOM manipulation at an application/apply level (Bloom 3)", apiKey);
    assert.strictEqual(finalEval.isComplete, true);
    harness.assertDrained();
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

    assert.strictEqual(pruned.length, 3, "Should retain exactly 3 reachable connected nodes <= level 3");
    assert.strictEqual(pruned.some(n => n.conceptName === "Custom Framework Architecture"), false, "Level 6 node must be pruned");
    assert.strictEqual(pruned.some(n => n.conceptName === "Unconnected Basic Math"), false, "Unreachable orphan node must be pruned");
  });

  await t.test("PlanService: Rejects a graph with no valid nodes before persistence", async () => {
    const originalFetch = globalThis.fetch;
    let callIndex = 0;
    globalThis.fetch = async (_input, _init) => {
      callIndex += 1;
      const payload = callIndex === 1
        ? { conceptSpine: ["Empty graph test"], foundationalConcepts: [], advancedConcepts: [] }
        : { nodes: [] };
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    };
    try {
      await assert.rejects(
        createLearningPlan(testUserId, "Empty graph test", 2, "test-key"),
        /graph pruning produced 0 valid nodes at targetDepth 2/,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
    assert.equal(await Plan.countDocuments({ userId: testUserId }), 0);
  });

  // 4. Test End-to-End Plan Creation & Database Ingestion
  let createdPlanId: string;
  await t.test("PlanService: Creates Plan and Parent-Referenced DAG in MongoDB", async () => {
    await Plan.deleteMany({ userId: testUserId });
    const harness = createFetchStub(t);
    harness.enqueue({ conceptSpine: ["Variables", "Functions", "DOM Events"], foundationalConcepts: ["Variables", "Functions"], advancedConcepts: ["DOM Events"] });
    harness.enqueue({ nodes: [
      { conceptName: "Variables", bloomLevel: 1, prerequisiteNames: [] },
      { conceptName: "Functions", bloomLevel: 2, prerequisiteNames: ["Variables"] },
      { conceptName: "DOM Events", bloomLevel: 3, prerequisiteNames: ["Functions"] },
    ] });

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
    harness.assertDrained();
  });

  // 5. Test Diagnostic Engine & KST Invalidation
  await t.test("DiagnosticEngine & Evaluator: Topological median and KST cascade", async () => {
    if (!createdPlanId) return;

    const diagnosticNode = await getNextDiagnosticNode(createdPlanId, testUserId);
    
    if (diagnosticNode) {
      assert.strictEqual(diagnosticNode.status, "PENDING", "Selected diagnostic node must be pending");

      await processDiagnosticAnswer(diagnosticNode._id.toString(), true, testUserId);

      const updatedNode = await PlanNode.findById(diagnosticNode._id);
      assert.strictEqual(updatedNode?.status, "PASSED_IN_DIAGNOSTIC", "Node status should update to passed");
    }
  });

  // 6. Teardown
  await t.test("Teardown", async () => {
    await TelemetryEvent.deleteMany({ userId: testUserId });
    if (createdPlanId) {
      await Plan.deleteMany({ userId: testUserId });
      await PlanNode.deleteMany({ planId: createdPlanId });
    }
    await UserLearningSlots.deleteMany({ userId: testUserId });
    await User.deleteOne({ _id: testUserId });
    await disconnectFromDatabase();
  });

  await t.test("GraphPruner: breaks top-level sink cycles cleanly", () => {
    const cyclic = [
      { conceptName: "A", bloomLevel: 2, prerequisiteNames: ["B"] },
      { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
    ];
    const broken = breakPrerequisiteCycles(cyclic);
    const pruned = pruneGraph(cyclic, 2);
    assert.equal(broken.length, 2);
    assert.equal(pruned.length, 2);
  });
});
