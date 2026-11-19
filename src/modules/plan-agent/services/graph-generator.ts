import { getAbsoluteMasterySystemPrompt } from "../utils/prompt-templates.js";
import { requestGeminiJson } from "../../../shared/utils/gemini-client.js";
import type { RawGraphNode } from "../types/graph.js";

export function parseGraph(payload: Record<string, unknown>): RawGraphNode[] {
  const parsed = payload.nodes;
  if (!Array.isArray(parsed)) {
    throw new Error("Gemini graph output must include a nodes array.");
  }

  for (const [index, node] of parsed.entries()) {
    const candidate = node as Record<string, unknown>;
    const prerequisites = candidate.prerequisiteNames;
    if (
      typeof node !== "object" ||
      node === null ||
      typeof candidate.conceptName !== "string" ||
      typeof candidate.bloomLevel !== "number" ||
      !Number.isInteger(candidate.bloomLevel) ||
      (candidate.bloomLevel as number) < 1 ||
      (candidate.bloomLevel as number) > 6 ||
      !Array.isArray(prerequisites) ||
      !prerequisites.every((name: unknown) => typeof name === "string")
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
  groundedContext?: { conceptSpine: string[]; foundationalConcepts: string[]; advancedConcepts: string[] },
): Promise<RawGraphNode[]> {
  console.log(`[Plan Agent] Starting Gemini graph fetch for topic: ${topic}`);
  const payload = await requestGeminiJson({
    prompt: `Generate the absolute mastery prerequisite graph for: ${topic}${groundedContext ? `\nOntology constraints: ${JSON.stringify(groundedContext)}` : ""}`,
    apiKey,
    context: "mastery graph",
    systemInstruction: getAbsoluteMasterySystemPrompt(topic),
  });
  const graph = parseGraph(payload);
  console.log(`[Plan Agent] Gemini graph parsing complete: ${graph.length} concepts.`);
  return graph;
}