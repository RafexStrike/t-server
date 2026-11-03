import { getAbsoluteMasterySystemPrompt } from "../utils/prompt-templates.js";
import type { RawGraphNode } from "../types/graph.js";

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

function parseGraph(text: string): RawGraphNode[] {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the mastery graph.", {
      cause: error,
    });
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini graph output must be a JSON array.");
  }

  for (const [index, node] of parsed.entries()) {
    if (
      typeof node !== "object" ||
      node === null ||
      typeof node.conceptName !== "string" ||
      typeof node.bloomLevel !== "number" ||
      !Number.isInteger(node.bloomLevel) ||
      node.bloomLevel < 1 ||
      node.bloomLevel > 6 ||
      !Array.isArray(node.prerequisiteNames) ||
      !node.prerequisiteNames.every(
        (prerequisiteName: unknown) => typeof prerequisiteName === "string",
      )
    ) {
      throw new Error(`Gemini graph output contains an invalid node at index ${index}.`);
    }
  }

  return parsed as RawGraphNode[];
}

/**
 * Requests the complete Bloom-6 prerequisite graph; pruning and persistence
 * belong to later Plan Agent stages.
 */
export async function generateAbsoluteMasteryGraph(
  topic: string,
  apiKey: string,
): Promise<RawGraphNode[]> {
  console.log(`[Plan Agent] Starting Gemini graph fetch for topic: ${topic}`);

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: getAbsoluteMasterySystemPrompt(topic) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Generate the absolute mastery prerequisite graph for: ${topic}` }],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  console.log(`[Plan Agent] Gemini graph fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini graph request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no graph content.");
  }

  const graph = parseGraph(text);
  console.log(`[Plan Agent] Gemini graph parsing complete: ${graph.length} concepts.`);
  return graph;
}