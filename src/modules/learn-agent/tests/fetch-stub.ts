import type { TestContext } from "node:test";

export interface GeminiRequestBody {
  systemInstruction?: { parts?: Array<{ text?: string }> };
  contents?: Array<{ parts?: Array<{ text?: string }> }>;
  generationConfig?: { responseMimeType?: string };
  [key: string]: unknown;
}

export interface CapturedFetchCall {
  url: string;
  method: string;
  headers: Headers;
  body: GeminiRequestBody;
  prompt: string;
}

type StubResponse = Response | unknown;
type ResponseHandler = (call: CapturedFetchCall) => StubResponse | Promise<StubResponse>;

function toGeminiResponse(payload: unknown): Response {
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function isResponse(value: StubResponse): value is Response {
  return value instanceof Response;
}

export function createFetchStub(t: TestContext) {
  const replies: ResponseHandler[] = [];
  const calls: CapturedFetchCall[] = [];
  const originalFetch = globalThis.fetch;

  const fetchMock: typeof fetch = async (input, init) => {
    const rawBody = init?.body ?? (input instanceof Request ? input.body : undefined);
    const body = typeof rawBody === "string"
      ? JSON.parse(rawBody) as GeminiRequestBody
      : {};
    const call: CapturedFetchCall = {
      url: input instanceof Request ? input.url : String(input),
      method: init?.method ?? (input instanceof Request ? input.method : "GET"),
      headers: new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)),
      body,
      prompt: [
        ...(body.systemInstruction?.parts ?? []).map((part) => part.text ?? ""),
        ...(body.contents ?? []).flatMap((content) =>
          (content.parts ?? []).map((part) => part.text ?? ""),
        ),
      ].join("\n"),
    };
    calls.push(call);

    const handler = replies.shift();
    if (!handler) {
      throw new Error(`Unexpected unstubbed fetch call: ${call.method} ${call.url}`);
    }

    const result = await handler(call);
    return isResponse(result) ? result : toGeminiResponse(result);
  };

  globalThis.fetch = fetchMock;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  return {
    calls,
    enqueue(payload: unknown) {
      replies.push(() => payload);
    },
    enqueueResponse(response: Response) {
      replies.push(() => response);
    },
    route(handler: ResponseHandler) {
      replies.push(handler);
    },
    assertDrained() {
      if (replies.length > 0) {
        throw new Error(`${replies.length} queued fetch response(s) were not consumed`);
      }
    },
  };
}