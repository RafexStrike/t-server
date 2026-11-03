/**
 * Builds the instruction that anchors graph generation in absolute mastery,
 * so later pruning can select the user's requested learning depth.
 */
export function getAbsoluteMasterySystemPrompt(topic: string): string {
  return `You are generating a prerequisite knowledge graph for the topic: "${topic}".

Assume the user wants Absolute Mastery of this topic, corresponding to Bloom's Taxonomy Level 6 (Create). Work backward from that outcome and include the atomic concepts and foundational prerequisites needed to reach it.

Return a JSON array of concept objects. Every object must have exactly these fields:
- "conceptName": a concise, distinct string naming one atomic concept
- "bloomLevel": an integer from 1 to 6 representing the mastery level for that concept
- "prerequisiteNames": an array of strings containing the exact conceptName values of its direct prerequisites in this array

Include all prerequisite concepts in the same array. Ensure prerequisite references use exact names from the array and the relationships form a directed acyclic graph. Output strictly valid JSON only, with no markdown fences or explanatory text.`;
}