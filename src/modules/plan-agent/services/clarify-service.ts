import { getClarificationSystemPrompt } from "../utils/clarify-prompts.js";
import type { LearningSlots, SlotEvaluationResult } from "../types/slots.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

function parseSlotEvaluation(text: string): SlotEvaluationResult {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the slot evaluation.", {
      cause: error,
    });
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Gemini slot evaluation must be a JSON object.");
  }

  const result = parsed as Record<string, unknown>;
  const slots = result.slots;
  if (typeof slots !== "object" || slots === null) {
    throw new Error("Gemini slot evaluation must include a slots object.");
  }

  const slotValues = slots as Record<string, unknown>;
  const { targetLanguageOrTool, specificSubdomain, targetDepth } = slotValues;
  if (
    (targetLanguageOrTool !== null && typeof targetLanguageOrTool !== "string") ||
    (specificSubdomain !== null && typeof specificSubdomain !== "string") ||
    (targetDepth !== null &&
      (typeof targetDepth !== "number" ||
        !Number.isInteger(targetDepth) ||
        targetDepth < 1 ||
        targetDepth > 6))
  ) {
    throw new Error("Gemini slot evaluation contains invalid slot values.");
  }

  if (
    typeof result.isComplete !== "boolean" ||
    (result.nextQuestion !== null && typeof result.nextQuestion !== "string")
  ) {
    throw new Error("Gemini slot evaluation contains invalid completion fields.");
  }

  const validatedSlots: LearningSlots = {
    targetLanguageOrTool,
    specificSubdomain,
    targetDepth,
  };
  const hasAllSlots =
    typeof targetLanguageOrTool === "string" &&
    targetLanguageOrTool.trim().length > 0 &&
    typeof specificSubdomain === "string" &&
    specificSubdomain.trim().length > 0 &&
    typeof targetDepth === "number";

  if (result.isComplete !== hasAllSlots) {
    throw new Error("Gemini slot evaluation has an inconsistent isComplete value.");
  }

  if (
    (result.isComplete && result.nextQuestion !== null) ||
    (!result.isComplete &&
      (typeof result.nextQuestion !== "string" || result.nextQuestion.trim().length === 0))
  ) {
    throw new Error("Gemini slot evaluation has an invalid nextQuestion value.");
  }

  return {
    slots: validatedSlots,
    isComplete: result.isComplete,
    nextQuestion: result.nextQuestion,
  };
}

export async function evaluateUserIntent(
  userMessage: string,
  currentSlots: LearningSlots,
  apiKey: string,
): Promise<SlotEvaluationResult> {
  console.log("[Plan Agent] Starting Gemini clarification evaluation.");

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: getClarificationSystemPrompt(currentSlots) }],
      },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  console.log(`[Plan Agent] Gemini clarification fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini clarification request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no slot evaluation content.");
  }

  const evaluation = parseSlotEvaluation(text);
  const missingSlots: string[] = [];
  if (!evaluation.slots.targetLanguageOrTool?.trim()) {
    missingSlots.push("targetLanguageOrTool");
  }
  if (!evaluation.slots.specificSubdomain?.trim()) {
    missingSlots.push("specificSubdomain");
  }
  if (evaluation.slots.targetDepth === null) {
    missingSlots.push("targetDepth");
  }

  console.log(
    `[Plan Agent] Clarification slots missing: ${missingSlots.length > 0 ? missingSlots.join(", ") : "none"}.`,
  );
  console.log(
    `[Plan Agent] Generated clarification question: ${evaluation.nextQuestion ?? "none; slots are complete"}`,
  );

  return evaluation;
}