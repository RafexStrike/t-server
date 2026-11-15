const BLOOM_LEVELS: Record<number, { name: string; guidance: string }> = {
  1: { name: "Remember", guidance: "Ask for concise recall of a key fact, term, or step." },
  2: { name: "Understand", guidance: "Ask the learner to explain or interpret the concept in their own words." },
  3: { name: "Apply", guidance: "Ask the learner to apply the concept to a small, concrete situation." },
  4: { name: "Analyze", guidance: "Ask the learner to examine relationships, predict behavior, or diagnose a small issue." },
  5: { name: "Evaluate", guidance: "Ask the learner to judge an approach using a clear criterion or trade-off." },
  6: { name: "Create", guidance: "Ask the learner to propose a concise design or solution that uses the concept." },
};

function getBloomLevel(bloomLevel: number): { name: string; guidance: string } {
  return BLOOM_LEVELS[bloomLevel] ?? {
    name: "Unknown",
    guidance: "Ask an appropriately scoped question that checks understanding of the concept.",
  };
}

export function getDiagnosticQuestionPrompt(
  topic: string,
  conceptName: string,
  bloomLevel: number,
): string {
  const level = getBloomLevel(bloomLevel);
  return `Generate one diagnostic question for a learner studying the topic: "${topic}".\n` +
    `Focus only on this concept: "${conceptName}".\n` +
    `Target Bloom's Taxonomy level ${bloomLevel} (${level.name}): ${level.guidance}\n` +
    "The question must be concise, answerable in a terminal, and assess only this concept at the requested cognitive depth. " +
    "Also provide expectedCriteria describing the essential evidence a passing answer must demonstrate. " +
    'Return only a JSON object matching exactly: { "question": string, "expectedCriteria": string }.';
}

export function getDiagnosticGradingPrompt(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  question: string,
  expectedCriteria: string,
  userAnswer: string,
): string {
  const level = getBloomLevel(bloomLevel);
  return `Evaluate this learner's diagnostic response for the topic "${topic}" and concept "${conceptName}".\n` +
    `Target Bloom's Taxonomy level ${bloomLevel} (${level.name}): ${level.guidance}\n` +
    `Question: ${question}\n` +
    `Passing criteria: ${expectedCriteria}\n` +
    `Learner response: ${userAnswer}\n` +
    "Decide whether the response demonstrates mastery of the concept at the target Bloom level. Be fair: prioritize conceptual and practical accuracy over minor phrasing or formatting flaws. " +
    "Mark vague, off-topic, or non-answers as not passed. Give 1-2 concise sentences of feedback explaining why the learner passed or what key concept was missing. " +
    'Return only a JSON object matching exactly: { "passed": boolean, "feedback": string }.';
}