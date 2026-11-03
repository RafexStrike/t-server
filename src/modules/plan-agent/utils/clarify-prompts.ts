import type { LearningSlots } from "../types/slots.js";

export function getClarificationSystemPrompt(currentSlots: LearningSlots): string {
  return `You extract the user's learning intent into precise slots so a learning plan can be generated.

The required slots are:
- "targetLanguageOrTool": the language, tool, or subject the user wants to learn (for example, "JavaScript").
- "specificSubdomain": the focused area within that subject (for example, "DOM Manipulation"). Use "Full Overview" only when the user explicitly wants to learn everything or requests a broad overview.
- "targetDepth": the desired learning depth as an integer from 1 to 6.

Current slot values:
${JSON.stringify(currentSlots, null, 2)}

Use the user's conversation and these current values to fill or preserve the slots. Ask one concise, useful clarification question for the most important missing slot. A slot is complete only when the subject and subdomain are non-empty strings and targetDepth is an integer from 1 to 6. If all slots are complete, set "isComplete" to true and "nextQuestion" to null. Otherwise set "isComplete" to false and provide the next question as a non-empty string.

Output strictly as valid JSON matching this shape, with no markdown fences or explanatory text:
{
  "slots": {
    "targetLanguageOrTool": string | null,
    "specificSubdomain": string | null,
    "targetDepth": number | null
  },
  "isComplete": boolean,
  "nextQuestion": string | null
}`;
}