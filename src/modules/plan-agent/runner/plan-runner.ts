import "dotenv/config";
import { homedir } from "node:os";
import { join } from "node:path";
import { chmod, readFile, unlink, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Types } from "mongoose";
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
import { createLearningPlan } from "../services/plan-service.js";

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
  const mastered = grouped.get("MASTERED")?.length ?? 0;
  const lines = [
    `Plan ID: ${planId}`,
    `User ID: ${userId}`,
    `[Total Concepts: ${nodes.length} | Passed: ${passed} | In Progress: ${inProgress} | Mastered: ${mastered}]`,
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
    evaluation = await evaluateUserIntent(userId, message, process.env.GEMINI_API_KEY ?? "");
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
    process.env.GEMINI_API_KEY ?? "",
  );
  await printSavedPlan(plan._id.toString(), userId);
  await clearUserLearningSlots(userId);
  return plan._id.toString();
}

async function runDiagnostics(planId: string, userId: string): Promise<void> {
  console.log(`[Runner] Starting diagnostics for plan ${planId} as user ${userId}.`);
  while (true) {
    const node = await getNextDiagnosticNode(planId, userId);
    if (!node) break;
    console.log();
    const answer = (await terminal.question(`Do you already know "${node.conceptName}"? [y/N]: `))
      .trim()
      .toLowerCase();
    await processDiagnosticAnswer(node._id.toString(), answer === "y" || answer === "yes", userId);
    console.log();
  }
  await Plan.updateOne(
    { _id: planId, userId },
    { $set: { status: "READY" } },
  );
  console.log("[Runner] No pending diagnostic nodes remain.");
  await printDiagnosticSummary(planId, userId);
}

async function main(): Promise<void> {
  await connectToDatabase();
  const { userId, email } = await authenticate();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Authenticated user id is invalid.");

  const activePlans = await Plan.find({
    userId,
    status: { $in: ["DIAGNOSTIC_IN_PROGRESS", "READY"] },
  }).sort({ updatedAt: -1 });
  console.log(`[Runner] ${activePlans.length} active plan(s) for ${email}.`);
  activePlans.forEach((plan, index) => {
    console.log(`  [${index + 1}] ${plan.topic} (${plan.status})`);
  });
  console.log("  [0] Start a new plan");

  const choice = Number((await terminal.question("Choose a plan: ")).trim());
  let planId: string;
  if (choice === 0) {
    planId = await createPlanForUser(userId);
  } else {
    const selected = activePlans[choice - 1];
    if (!selected) throw new Error("Choose one of the listed plans.");
    planId = selected._id.toString();
  }
  await runDiagnostics(planId, userId);
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