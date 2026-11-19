import assert from "node:assert/strict";
import test from "node:test";
import { requestGeminiJson } from "../../../shared/utils/gemini-client.js";

test("Gemini client retries HTTP 429 and 503, then accepts a successful response", async () => {
  const originalFetch = globalThis.fetch;
  let requestCount = 0;
  globalThis.fetch = async () => {
    requestCount += 1;
    if (requestCount === 1 || requestCount === 2) {
      return new Response(JSON.stringify({ error: { message: "try again" } }), {
        status: requestCount === 1 ? 429 : 503,
        headers: { "Content-Type": "application/json", "Retry-After": "0" },
      });
    }
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify({ accepted: true }) }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const result = await requestGeminiJson({
      prompt: "test",
      apiKey: "test-key",
      context: "retry test",
      retries: 2,
    });
    assert.deepEqual(result, { accepted: true });
    assert.equal(requestCount, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Gemini client does not retry a non-transient HTTP 400", async () => {
  const originalFetch = globalThis.fetch;
  let requestCount = 0;
  globalThis.fetch = async () => {
    requestCount += 1;
    return new Response(JSON.stringify({ error: { message: "bad request" } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await assert.rejects(
      requestGeminiJson({
        prompt: "test",
        apiKey: "test-key",
        context: "retry test",
        retries: 3,
      }),
      /request failed \(400\): bad request/,
    );
    assert.equal(requestCount, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});