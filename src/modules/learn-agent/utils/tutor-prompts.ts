import type {
  LearnerEvaluationPromptInput,
  TutorTurnPromptInput,
} from "../types/tutor.js";

const BLOOM_LEVEL_NAMES = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

export function getMicroLessonPrompt(input: TutorTurnPromptInput): string {
  const bloomName = BLOOM_LEVEL_NAMES[input.bloomLevel - 1] ?? "Unknown";
  const remediation = input.previousAttempt !== undefined && input.tutorFeedback !== undefined
    ? `\nThe learner's previous attempt was: ${input.previousAttempt}\nTutor feedback identifying the misconception: ${input.tutorFeedback}\nAddress that specific misconception concisely. Do not repeat the full prior lecture.`
    : "";
  const directives = input.scaffoldingDirectives.length
    ? input.scaffoldingDirectives.map((directive) => `- ${directive}`).join("\n")
    : "- Keep the lesson focused and concise; teach only the requested node.";
  const preGate = `\nSystem 1 intrinsic pre-gate: mode=${input.preGateResult.mode}; remaining extrinsic load budget=${input.preGateResult.extrinsicBudget.toFixed(2)}.${input.preGateResult.mode === "OPTIMAL" ? " No additional pre-gate restrictions apply." : ` Treat this budget as a strict constraint.\n${input.preGateResult.proactiveDirectives.map((directive) => `- ${directive}`).join("\n")}`}`;

  return `Act as a node-scoped Micro-Tutor. Teach strictly the concept "${input.conceptName}" at Bloom level ${input.bloomLevel}: ${bloomName}. The topic "${input.topic}" may only be used to disambiguate terminology; do not teach adjacent concepts or other nodes.\n\nMandatory System 1 scaffolding constraints (follow every directive):\n${directives}${preGate}${remediation}\n\nReturn only strict JSON with exactly these string fields: { "explanation": string, "checkQuestion": string, "expectedCriteria": string }.`;
}

export function getLearnerEvaluationPrompt(
  input: LearnerEvaluationPromptInput,
): string {
  const bloomName = BLOOM_LEVEL_NAMES[input.bloomLevel - 1] ?? "Unknown";
  return `Evaluate the learner's response only against the expected criteria for "${input.conceptName}" at Bloom level ${input.bloomLevel}: ${bloomName}. Use topic "${input.topic}" only to disambiguate terminology. Prioritize conceptual and practical accuracy over minor syntax or phrasing flaws.\n\nQuestion: ${input.checkQuestion}\nExpected criteria: ${input.expectedCriteria}\nLearner response: ${input.userAnswer}\n\nReturn only strict JSON with these fields: { "mastered": boolean, "feedback": string, "hint": string | null }.`;
}