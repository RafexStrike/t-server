import { requestGeminiJson } from "../../../shared/utils/gemini-client.js";

export interface GroundedOntology {
  conceptSpine: string[];
  foundationalConcepts: string[];
  advancedConcepts: string[];
}

export async function groundOntology(topic: string, apiKey: string): Promise<GroundedOntology> {
  const payload = await requestGeminiJson({
    prompt: `Normalize the canonical domain concepts for "${topic}" and classify them as foundational or advanced.`,
    apiKey,
    context: "ontology grounding",
    systemInstruction:
      "Return JSON with conceptSpine, foundationalConcepts, and advancedConcepts arrays. Use canonical concise concept names and preserve prerequisite-friendly ordering.",
  });
  const readNames = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
      : [];
  return {
    conceptSpine: readNames(payload.conceptSpine),
    foundationalConcepts: readNames(payload.foundationalConcepts),
    advancedConcepts: readNames(payload.advancedConcepts),
  };
}
