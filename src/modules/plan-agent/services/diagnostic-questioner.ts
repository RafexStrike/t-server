import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { recordTelemetryEvent } from "../../telemetry/services/telemetry-logger.js";
import { requestGeminiJson } from "../../../shared/utils/gemini-client.js";
import type {
  DiagnosticEvaluationResult,
  DiagnosticQuestion,
} from "../types/diagnostic.js";
import {
  getDiagnosticGradingPrompt,
  getDiagnosticQuestionPrompt,
} from "../utils/diagnostic-prompts.js";

const SKIP_ANSWERS = new Set([
  "skip",
  "idk",
  "i dont know",
  "dont know",
  "pass",
  "no",
  "n",
]);

export async function generateDiagnosticQuestion(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  apiKey: string,
  context?: { planId: string; userId: string; nodeId: string },
): Promise<DiagnosticQuestion> {
  const startedAt = Date.now();
  const text = await requestGeminiJson({
    prompt: getDiagnosticQuestionPrompt(topic, conceptName, bloomLevel),
    apiKey,
    context: "diagnostic question",
  });
  if (
    typeof text.question !== "string" ||
    text.question.trim().length === 0 ||
    typeof text.expectedCriteria !== "string" ||
    text.expectedCriteria.trim().length === 0
  ) {
    throw new Error("Gemini diagnostic question must include non-empty question and expectedCriteria strings.");
  }
  const diagnosticQuestion = {
    question: text.question.trim(),
    expectedCriteria: text.expectedCriteria.trim(),
  };
  console.log(`[Plan Agent] Generated diagnostic question for "${conceptName}" (Bloom ${bloomLevel}).`);
  await recordTelemetryEvent({
    ...(context
      ? { planId: context.planId, userId: context.userId, nodeId: context.nodeId }
      : {}),
    conceptKey: normalizeConceptName(conceptName),
    agent: "plan-agent",
    eventType: "diagnostic_question_asked",
    metrics: { durationMs: Date.now() - startedAt },
    metadata: { topic, bloomLevel },
  });
  return diagnosticQuestion;
}

export async function evaluateDiagnosticResponse(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  question: string,
  expectedCriteria: string,
  userAnswer: string,
  apiKey: string,
): Promise<DiagnosticEvaluationResult> {
  const normalizedAnswer = userAnswer.trim().toLowerCase().replace(/['’.!?]/g, "");
  if (normalizedAnswer.length === 0 || SKIP_ANSWERS.has(normalizedAnswer)) {
    console.log(`[Plan Agent] Diagnostic fast-path skip for "${conceptName}"; marked for learning.`);
    return { passed: false, feedback: "Skipped; marked for learning." };
  }

  const text = await requestGeminiJson({
    prompt: getDiagnosticGradingPrompt(
      topic,
      conceptName,
      bloomLevel,
      question,
      expectedCriteria,
      userAnswer,
    ),
    apiKey,
    context: "diagnostic grading",
  });
  const result = text;
  if (
    typeof result.passed !== "boolean" ||
    typeof result.feedback !== "string" ||
    result.feedback.trim().length === 0
  ) {
    throw new Error("Gemini diagnostic grading must include a boolean passed and non-empty feedback string.");
  }
  const evaluation = { passed: result.passed, feedback: result.feedback.trim() };
  console.log(
    `[Plan Agent] Diagnostic verdict for "${conceptName}": ${evaluation.passed ? "PASS" : "FAIL"}.`,
  );
  return evaluation;
}