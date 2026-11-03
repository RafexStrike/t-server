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
  await clearUserLearningSlots(userId);
  return plan._id.toString();
}

async function runDiagnostics(planId: string, userId: string): Promise<void> {
  console.log(`[Runner] Starting diagnostics for plan ${planId} as user ${userId}.`);
  while (true) {
    const node = await getNextDiagnosticNode(planId, userId);
    if (!node) break;
    const answer = (await terminal.question(`Do you already know "${node.conceptName}"? [y/N]: `))
      .trim()
      .toLowerCase();
    await processDiagnosticAnswer(node._id.toString(), answer === "y" || answer === "yes", userId);
  }
  await Plan.updateOne(
    { _id: planId, userId },
    { $set: { status: "READY" } },
  );
  console.log("[Runner] No pending diagnostic nodes remain.");
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