export const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

export interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
}

export function parseJsonObject(text: string, context: string): Record<string, unknown> {
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

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 500,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= retries) throw error;
      const delayMs = baseDelayMs * 2 ** attempt + Math.random() * 250;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export function getGeminiText(payload: GeminiResponse, context: string): string {
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini returned no ${context} content.`);
  return text;
}

export async function requestGeminiJson(params: {
  prompt: string;
  apiKey: string;
  context: string;
  systemInstruction?: string;
  timeoutMs?: number;
  retries?: number;
}): Promise<Record<string, unknown>> {
  if (!params.apiKey.trim()) throw new Error(`GEMINI_API_KEY is required for ${params.context}.`);
  const response = await fetchWithRetry(() =>
    fetch(GEMINI_ENDPOINT, {
      method: "POST",
      signal: AbortSignal.timeout(params.timeoutMs ?? 30_000),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": params.apiKey,
      },
      body: JSON.stringify({
        ...(params.systemInstruction
          ? { systemInstruction: { parts: [{ text: params.systemInstruction }] } }
          : {}),
        contents: [{ role: "user", parts: [{ text: params.prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
    params.retries ?? 3,
  );
  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini ${params.context} request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }
  return parseJsonObject(getGeminiText(payload, params.context), params.context);
}
