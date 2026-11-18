import { homedir } from "node:os";
import { join } from "node:path";
import { chmod, readFile, unlink, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Types } from "mongoose";
import { env, validateEnv } from "../../../config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import {
  loginUser,
  registerUser,
  verifySessionToken,
} from "../../auth/services/auth-service.js";
import { Plan } from "../models/Plan.js";
import { PlanNode, type PlanNodeDocument, type PlanNodeStatus } from "../models/PlanNode.js";
import {
  clearUserLearningSlots,
  getUserLearningSlots,
  evaluateUserIntent,
} from "../services/clarify-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import {
  evaluateDiagnosticResponse,
  generateDiagnosticQuestion,
} from "../services/diagnostic-questioner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getOuterFringe } from "../../learn-agent/services/outer-fringe.js";
import {
  loadLearningNodeState,
  prepareNodeLesson,
  submitNodeAttempt,
} from "../../learn-agent/services/micro-tutor.js";
import { DEFAULT_WML_CAPACITY } from "../../learn-agent/utils/wml-calculator.js";
import { getLearningFringeState } from "../../learn-agent/utils/outer-fringe-selector.js";
import { parsePlanChoice } from "./plan-choice.js";

const sessionPath = join(homedir(), ".plan-agent-session.json");
const terminal = createInterface({ input: stdin, output: stdout });
const BLOOM_LEVEL_NAMES = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

function printBox(title: string, lines: string[]): void {
  const width = Math.max(title.length, ...lines.map((line) => line.length));
  const divider = `+${"-".repeat(width + 2)}+`;
  console.log(divider);
  console.log(`| ${title.padEnd(width)} |`);
  console.log(divider);
  for (const line of lines) console.log(`| ${line.padEnd(width)} |`);
  console.log(divider);
}

async function printSavedPlan(planId: string, userId: string): Promise<void> {
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Saved plan ${planId} could not be loaded for its owner.`);

  const nodes = await PlanNode.find({ planId: plan._id }).sort({ bloomLevel: 1, conceptName: 1 });
  const conceptNames = new Map(nodes.map((node) => [node._id.toString(), node.conceptName]));
  const graphLines = nodes.flatMap((node, index) => {
    const branch = index === nodes.length - 1 ? "\\--" : "|--";
    const continuation = index === nodes.length - 1 ? "    " : "|   ";
    const prerequisites = node.prerequisites.map((id) => conceptNames.get(id.toString()) ?? id.toString());
    const levelName = BLOOM_LEVEL_NAMES[node.bloomLevel - 1] ?? "Unknown";
    return [
      `${branch} ${node._id.toString()} | ${node.conceptName}`,
      `${continuation}[Level ${node.bloomLevel}: ${levelName}] ${node.status}`,
      `${continuation}Prerequisites: ${prerequisites.length ? prerequisites.join(", ") : "None"}`,
    ];
  });

  printBox("Saved Learning Plan", [
    `Plan ID: ${plan._id.toString()}`,
    `User ID: ${plan.userId.toString()}`,
    `Topic: ${plan.topic}`,
    `Target Bloom Depth: Level ${plan.targetDepth} (${BLOOM_LEVEL_NAMES[plan.targetDepth - 1] ?? "Unknown"})`,
    `Initial Status: ${plan.status}`,
    "",
    "Pruned Curriculum DAG:",
    ...(graphLines.length ? graphLines : ["(no saved concepts)"]),
  ]);
}

async function printDiagnosticSummary(planId: string, userId: string): Promise<void> {
  const nodes = await PlanNode.find({ planId }).sort({ bloomLevel: 1, conceptName: 1 });
  const statuses: PlanNodeStatus[] = [
    "PASSED_IN_DIAGNOSTIC",
    "IN_PROGRESS",
    "MASTERED",
    "PENDING",
  ];
  const grouped = new Map<PlanNodeStatus, PlanNodeDocument[]>(
    statuses.map((status) => [status, []]),
  );
  for (const node of nodes) grouped.get(node.status)?.push(node);

  const passed = grouped.get("PASSED_IN_DIAGNOSTIC")?.length ?? 0;
  const inProgress = grouped.get("IN_PROGRESS")?.length ?? 0;
  const pending = grouped.get("PENDING")?.length ?? 0;
  const mastered = grouped.get("MASTERED")?.length ?? 0;
  const lines = [
    `Plan ID: ${planId}`,
    `User ID: ${userId}`,
    `[Total Concepts: ${nodes.length} | Finished during diagnosis: ${passed} | Queued for Micro-Tutor: ${inProgress + pending} (In Progress: ${inProgress}, Pending: ${pending}) | Mastered: ${mastered}]`,
    "",
  ];
  for (const status of statuses) {
    lines.push(`${status}:`);
    const group = grouped.get(status) ?? [];
    if (group.length === 0) lines.push("  (none)");
    else for (const node of group) lines.push(`  - ${node.conceptName} (${node._id.toString()})`);
    lines.push("");
  }
  printBox("Diagnostic Results Summary", lines);
}

async function authenticate(): Promise<{ userId: string; email: string }> {
  try {
    const saved = JSON.parse(await readFile(sessionPath, "utf8")) as { sessionToken?: unknown };
    if (typeof saved.sessionToken === "string") {
      const userId = verifySessionToken(saved.sessionToken);
      const user = await User.findById(userId).select("email");
      if (user) {
        console.log(`[Runner] Reusing local session for ${user.email}.`);
        return { userId: user._id.toString(), email: user.email };
      }
    }
  } catch {
    console.log("[Runner] No valid local session found; sign-in is required.");
  }
  await unlink(sessionPath).catch(() => undefined);

  while (true) {
    const action = (await terminal.question("[1] Login  [2] Sign Up: ")).trim();
    const email = (await terminal.question("Email: ")).trim();
    const password = await terminal.question("Password: ");
    try {
      const result = action === "2"
        ? await registerUser(email, password, (await terminal.question("Name (optional): ")).trim())
        : await loginUser(email, password);
      await writeFile(sessionPath, JSON.stringify({ sessionToken: result.sessionToken }), {
        encoding: "utf8",
        mode: 0o600,
      });
      await chmod(sessionPath, 0o600);
      console.log(`[Runner] Signed in as ${result.user.email}; local session saved securely.`);
      return { userId: result.user.userId, email: result.user.email };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      console.error(`[Runner] Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function createPlanForUser(userId: string): Promise<string> {
  let evaluation;
  do {
    const message = await terminal.question(
      evaluation?.nextQuestion ? `Clarification: ${evaluation.nextQuestion}\nYou: ` : "Learning goal: ",
    );
    evaluation = await evaluateUserIntent(userId, message, env.GEMINI_API_KEY ?? "");
    if (!evaluation.isComplete && evaluation.nextQuestion) {
      console.log(`[Runner] ${evaluation.nextQuestion}`);
    }
  } while (!evaluation?.isComplete);

  const slots = await getUserLearningSlots(userId);
  if (!slots.targetLanguageOrTool || !slots.specificSubdomain || !slots.targetDepth) {
    throw new Error("Clarification completed without all required learning slots.");
  }
  const topic = `${slots.targetLanguageOrTool}: ${slots.specificSubdomain}`;
  const plan = await createLearningPlan(
    userId,
    topic,
    slots.targetDepth,
    env.GEMINI_API_KEY ?? "",
  );
  await printSavedPlan(plan._id.toString(), userId);
  await clearUserLearningSlots(userId);
  return plan._id.toString();
}

async function runDiagnostics(planId: string, userId: string): Promise<void> {
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  const apiKey = env.GEMINI_API_KEY ?? "";
  const totalNodes = await PlanNode.countDocuments({ planId });
  const maxQuestions = Math.max(5, Math.min(10, Math.ceil(totalNodes * 0.4)));
  let questionsAsked = 0;
  console.log("=== Phase 1: Adaptive Diagnostic ===");
  console.log(`[Runner] Starting diagnostics for plan ${planId} as user ${userId}.`);
  while (true) {
    if (questionsAsked >= maxQuestions) {
      await PlanNode.updateMany(
        { planId, status: "PENDING" },
        { $set: { status: "IN_PROGRESS" } },
      );
      console.log(`[Runner] Diagnostic question budget (${maxQuestions}) reached; remaining pending concepts marked IN_PROGRESS.`);
      break;
    }
    const node = await getNextDiagnosticNode(planId, userId);
    if (!node) break;
    const diagnosticQuestion = await generateDiagnosticQuestion(
      plan.topic,
      node.conceptName,
      node.bloomLevel,
      apiKey,
      { planId, userId, nodeId: node._id.toString() },
    );
    const bloomLevelName = BLOOM_LEVEL_NAMES[node.bloomLevel - 1] ?? "Unknown";
    console.log();
    console.log(`[Plan Agent] Concept: ${node.conceptName}`);
    console.log(`[Plan Agent] Bloom level: ${node.bloomLevel} (${bloomLevelName})`);
    console.log(`[Plan Agent] ${diagnosticQuestion.question}`);
    const userAnswer = await terminal.question("Your answer (or 'skip' if unsure): ");
    questionsAsked += 1;
    const evaluation = await evaluateDiagnosticResponse(
      plan.topic,
      node.conceptName,
      node.bloomLevel,
      diagnosticQuestion.question,
      diagnosticQuestion.expectedCriteria,
      userAnswer,
      apiKey,
    );
    console.log(`[${evaluation.passed ? "PASS" : "FAIL"}] ${evaluation.feedback}`);
    await processDiagnosticAnswer(node._id.toString(), evaluation.passed, userId);
    const [passedCount, pendingCount] = await Promise.all([
      PlanNode.countDocuments({ planId, status: "PASSED_IN_DIAGNOSTIC" }),
      PlanNode.countDocuments({ planId, status: "PENDING" }),
    ]);
    const resolvedCount = totalNodes - pendingCount;
    console.log(
      `[Diagnostic Progress] Finished/tested out: ${passedCount} / ${totalNodes} concepts | Diagnostic resolved: ${resolvedCount} / ${totalNodes} (${pendingCount} pending)`,
    );
    console.log();
  }
  await Plan.updateOne(
    { _id: planId, userId },
    { $set: { status: "READY" } },
  );
  console.log("[Runner] No pending diagnostic nodes remain.");
  await printDiagnosticSummary(planId, userId);
}

async function runLearningSession(planId: string, userId: string): Promise<void> {
  const apiKey = env.GEMINI_API_KEY ?? "";
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  const learner = await User.findOne({ _id: userId }).select("capacityThreshold");
  if (!learner) throw new Error("Authenticated user could not be loaded for the learning session.");
  let capacityThreshold = learner.capacityThreshold ?? DEFAULT_WML_CAPACITY;

  console.log("=== Phase 2: Micro-Tutor Learning Session ===");
  while (true) {
    const fringe = await getOuterFringe(planId, userId);
    const totalNodes = await PlanNode.countDocuments({ planId });
    const completedCount = totalNodes - fringe.remainingCount;
    const currentNodeNumber = completedCount + 1;
    const fringeState = getLearningFringeState(fringe);
    if (fringeState === "COMPLETED") {
      const [plan, diagnosticPassedCount, tutoredMasteredCount] = await Promise.all([
        Plan.findOne({ _id: planId, userId }),
        PlanNode.countDocuments({ planId, status: "PASSED_IN_DIAGNOSTIC" }),
        PlanNode.countDocuments({ planId, status: "MASTERED" }),
      ]);
      const totalCompleted = diagnosticPassedCount + tutoredMasteredCount;
      printBox("Plan Completed", [
        `Topic: ${plan?.topic ?? "Unknown"}`,
        `Plan ID: ${planId}`,
        `Total Completed: ${totalCompleted} / ${totalNodes} concepts`,
        `  - Completed during diagnosis: ${diagnosticPassedCount}`,
        `  - Mastered via Micro-Tutor:   ${tutoredMasteredCount}`,
      ]);
      break;
    }
    if (fringeState === "BLOCKED") {
      console.error(
        `[Runner][Graph Deadlock] No unlocked learning nodes remain, but ${fringe.remainingCount} node(s) are unfinished for plan ${planId}.`,
      );
      break;
    }

    const selected = fringe.unlockedNodes.find((node) => node.nodeId === fringe.nextNodeId);
    if (!selected) throw new Error("Outer Fringe selected a node that was not in its candidate list.");
    console.log(
      `[Runner] Outer Fringe candidates: ${fringe.unlockedNodes.length} | Selected: ${selected.conceptName} (Bloom ${selected.bloomLevel}) | Remaining: ${fringe.remainingCount}.`,
    );

    await PlanNode.updateOne(
      { _id: selected.nodeId, planId },
      { $set: { status: "IN_PROGRESS" } },
    );
    const savedState = await loadLearningNodeState(planId, userId, selected.nodeId);
    capacityThreshold = savedState.capacityThreshold;
    let attemptCount = savedState.attemptCount + 1;
    let previousAttempt = savedState.previousAttempt;
    let tutorFeedback = savedState.tutorFeedback;
    let scaffoldingDirectives: string[] = [];
    const wmlSamples = savedState.wmlSamples;
    if (savedState.attemptCount > 0) {
      console.log(
        `[Runner] Resuming ${selected.conceptName} after ${savedState.attemptCount} recorded attempt(s).${tutorFeedback ? ` Latest feedback: ${tutorFeedback}` : ""}`,
      );
    }
    let shouldExit = false;

    while (true) {
      const turn = await prepareNodeLesson({
        planId,
        userId,
        nodeId: selected.nodeId,
        apiKey,
        capacityThreshold,
        ...(previousAttempt !== undefined ? { previousAttempt } : {}),
        ...(tutorFeedback !== undefined ? { tutorFeedback } : {}),
        ...(scaffoldingDirectives.length > 0 ? { scaffoldingDirectives } : {}),
      });
      scaffoldingDirectives = [...new Set([
        ...scaffoldingDirectives,
        ...turn.wmlAssessment.scaffoldingDirectives,
      ])];
      wmlSamples.push(turn.wmlAssessment.totalWml);
      console.log();
      const bloomLevelName = BLOOM_LEVEL_NAMES[selected.bloomLevel - 1] ?? "Unknown";
      console.log(
        `(${selected.conceptName}: learning node ${currentNodeNumber} out of ${totalNodes} | Bloom ${selected.bloomLevel}: ${bloomLevelName} | ${fringe.remainingCount} remaining)`,
      );
      console.log("---");
      const attemptLabel = attemptCount > 1 ? `Attempt ${attemptCount} - Remediation` : `Attempt ${attemptCount}`;
      const gatekeeperNote = turn.wasRegeneratedForOverload
        ? " (simplified by WML gatekeeper)"
        : "";
      console.log(
        `${attemptLabel} | WML: ${turn.wmlAssessment.totalWml.toFixed(2)} [${turn.wmlAssessment.loadLevel}]${gatekeeperNote}`,
      );
      console.log(`[Micro-Tutor] ${turn.lesson.explanation}`);
      console.log(`[Check] ${turn.lesson.checkQuestion}`);
      const userAnswer = await terminal.question("Your answer (or 'exit' to pause): ");
      if (["exit", "quit"].includes(userAnswer.trim().toLowerCase())) {
        console.log(`[Runner] Pausing with "${selected.conceptName}" saved as IN_PROGRESS.`);
        console.log(
          `Progress saved: ${completedCount} / ${totalNodes} concepts completed. Resume anytime from the main menu.`,
        );
        shouldExit = true;
        break;
      }

      const averageWml = wmlSamples.reduce((sum, score) => sum + score, 0) / wmlSamples.length;
      const evaluation = await submitNodeAttempt({
        planId,
        userId,
        nodeId: selected.nodeId,
        lesson: turn.lesson,
        wmlAssessment: turn.wmlAssessment,
        userAnswer,
        attemptCount,
        averageWml,
        capacityThreshold,
        wmlSamples,
        apiKey,
      });
      capacityThreshold = evaluation.updatedCapacityThreshold;
      if (evaluation.mastered) {
        console.log(`[Mastered] ${evaluation.feedback}`);
        console.log(`[Runner] Updated cognitive capacity threshold: ${capacityThreshold.toFixed(2)}.`);
        break;
      }

      console.log(`[Not yet] ${evaluation.feedback}`);
      if (evaluation.hint) console.log(`[Hint] ${evaluation.hint}`);
      previousAttempt = userAnswer;
      tutorFeedback = [evaluation.feedback, evaluation.hint].filter(Boolean).join(" ");
      attemptCount += 1;
    }

    if (shouldExit) break;
  }
}

async function main(): Promise<void> {
  const config = validateEnv();
  await connectToDatabase(config.MONGODB_URI);
  const { userId, email } = await authenticate();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Authenticated user id is invalid.");

  const activePlans = await Plan.find({
    userId,
    status: { $in: ["DIAGNOSTIC_IN_PROGRESS", "READY"] },
  }).sort({ updatedAt: -1 });
  console.log(`[Runner] ${activePlans.length} active plan(s) for ${email}.`);
  const activePlanProgress = await Promise.all(
    activePlans.map(async (plan) => {
      const [totalNodes, diagnosticPassedCount, tutoredMasteredCount] = await Promise.all([
        PlanNode.countDocuments({ planId: plan._id }),
        PlanNode.countDocuments({ planId: plan._id, status: "PASSED_IN_DIAGNOSTIC" }),
        PlanNode.countDocuments({ planId: plan._id, status: "MASTERED" }),
      ]);
      return {
        totalNodes,
        completedCount: diagnosticPassedCount + tutoredMasteredCount,
      };
    }),
  );
  activePlans.forEach((plan, index) => {
    const progress = activePlanProgress[index];
    console.log(
      `  [${index + 1}] ${plan.topic} (${plan.status} - ${progress?.completedCount ?? 0}/${progress?.totalNodes ?? 0} concepts completed)`,
    );
  });
  console.log("  [0] Start a new plan");

  let choice: number | undefined;
  while (choice === undefined) {
    const rawChoice = await terminal.question("Choose a plan: ");
    choice = parsePlanChoice(rawChoice, activePlans.length);
    if (choice === undefined) {
      console.error("[Runner] Invalid choice. Enter 0 or the number of a listed plan.");
    }
  }
  let planId: string;
  if (choice === 0) {
    planId = await createPlanForUser(userId);
  } else {
    const selected = activePlans[choice - 1];
    if (!selected) throw new Error("Choose one of the listed plans.");
    planId = selected._id.toString();
  }
  let plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  if (plan.status === "DIAGNOSTIC_IN_PROGRESS") {
    await runDiagnostics(planId, userId);
  }
  plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be reloaded for its owner.`);
  if (plan.status === "READY") {
    await runLearningSession(planId, userId);
  }
}

try {
  await main();
} catch (error) {
  console.error(`[Runner] Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  terminal.close();
  await disconnectFromDatabase();
}