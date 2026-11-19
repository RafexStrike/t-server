import assert from "node:assert/strict";
import test from "node:test";
import { generateAbsoluteMasteryGraph } from "../services/graph-generator.js";
import { getAbsoluteMasterySystemPrompt } from "../utils/prompt-templates.js";

test("absolute mastery prompt and graph parser use a top-level nodes object", async () => {
  const originalFetch = globalThis.fetch;
  let systemInstruction = "";
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      systemInstruction?: { parts?: Array<{ text?: string }> };
    };
    systemInstruction = body.systemInstruction?.parts?.[0]?.text ?? "";
    return new Response(JSON.stringify({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              nodes: [{
                conceptName: "Variables",
                bloomLevel: 1,
                prerequisiteNames: [],
              }],
            }),
          }],
        },
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const prompt = getAbsoluteMasterySystemPrompt("JavaScript basics");
    assert.match(prompt, /JSON object with a top-level "nodes" array/);
    const graph = await generateAbsoluteMasteryGraph("JavaScript basics", "test-key");
    assert.match(systemInstruction, /"nodes"/);
    assert.deepEqual(graph, [{
      conceptName: "Variables",
      bloomLevel: 1,
      prerequisiteNames: [],
    }]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});