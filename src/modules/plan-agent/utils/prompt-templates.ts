/**
 * Builds the instruction that anchors graph generation in absolute mastery,
 * so later pruning can select the user's requested learning depth.
 */
export function getAbsoluteMasterySystemPrompt(topic: string): string {
  return `You are generating a prerequisite knowledge graph for the topic: "${topic}".

Assume the user wants Absolute Mastery of this topic, corresponding to Bloom's Taxonomy Level 6 (Create). Work backward from that outcome and include the atomic concepts and foundational prerequisites needed to reach it.

Return a JSON object with a top-level "nodes" array: { "nodes": [ ... ] }. Every object in "nodes" must have exactly these fields:
- "conceptName": a concise, distinct string naming one atomic concept
- "bloomLevel": an integer from 1 to 6 representing the mastery level for that concept
- "prerequisiteNames": an array of strings containing the exact conceptName values of its direct prerequisites in this array

Include all prerequisite concepts in the same array. Keep the graph compact and cohesive, with 15 to 28 concepts total across Bloom Levels 1 through 6, rather than producing a sprawling disconnected list. Only 1 to 3 true foundational axioms at Bloom Level 1 may have an empty "prerequisiteNames" array. Every other concept, including all non-axiom concepts at Level 1 and every concept at Level 2 or above, must name its direct prerequisites in "prerequisiteNames". Build connected, step-by-step prerequisite chains (for example: "Programming Language Fundamentals" -> "JavaScript Primitive Data Types" -> "JavaScript Control Flow" -> "JavaScript Scope" -> "Asynchronous Programming Concepts" -> "Event-Driven Architecture"). Ensure prerequisite references use exact names from the array and the relationships form a directed acyclic graph. Output strictly valid JSON only, with no markdown fences or explanatory text.`;
}