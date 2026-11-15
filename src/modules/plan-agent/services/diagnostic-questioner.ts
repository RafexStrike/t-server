import { fetchWithRetry } from "../../common/utils/retry.js";
import type {
  DiagnosticEvaluationResult,
  DiagnosticQuestion,
} from "../types/diagnostic.js";
import {
  getDiagnosticGradingPrompt,
  getDiagnosticQuestionPrompt,
} from "../utils/diagnostic-prompts.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
const SKIP_ANSWERS = new Set([
  "skip",
  "idk",
  "i don't know",
  "dont know",
  "pass",
  "no",
  "n",
]);

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

function parseJsonObject(text: string, context: string): Record<string, unknown> {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON for ${context}.`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Gemini ${context} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function getResponseText(payload: GeminiResponse, context: string): string {
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini returned no ${context} content.`);
  return text;
}

async function requestGemini(prompt: string, apiKey: string, context: string): Promise<string> {
  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );
  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini ${context} request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }
  return getResponseText(payload, context);
}

export async function generateDiagnosticQuestion(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  apiKey: string,
): Promise<DiagnosticQuestion> {
  const text = await requestGemini(
    getDiagnosticQuestionPrompt(topic, conceptName, bloomLevel),
    apiKey,
    "diagnostic question",
  );
  const result = parseJsonObject(text, "diagnostic question");
  if (
    typeof result.question !== "string" ||
    result.question.trim().length === 0 ||
    typeof result.expectedCriteria !== "string" ||
    result.expectedCriteria.trim().length === 0
  ) {
    throw new Error("Gemini diagnostic question must include non-empty question and expectedCriteria strings.");
  }
  const diagnosticQuestion = {
    question: result.question.trim(),
    expectedCriteria: result.expectedCriteria.trim(),
  };
  console.log(`[Plan Agent] Generated diagnostic question for "${conceptName}" (Bloom ${bloomLevel}).`);
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
  const normalizedAnswer = userAnswer.trim().toLowerCase();
  if (normalizedAnswer.length === 0 || SKIP_ANSWERS.has(normalizedAnswer)) {
    console.log(`[Plan Agent] Diagnostic fast-path skip for "${conceptName}"; marked for learning.`);
    return { passed: false, feedback: "Skipped; marked for learning." };
  }

  const text = await requestGemini(
    getDiagnosticGradingPrompt(
      topic,
      conceptName,
      bloomLevel,
      question,
      expectedCriteria,
      userAnswer,
    ),
    apiKey,
    "diagnostic grading",
  );
  const result = parseJsonObject(text, "diagnostic grading");
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