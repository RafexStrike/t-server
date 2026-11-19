const TRANSIENT_HTTP_STATUSES = new Set([429, 502, 503, 504]);

function getTransientResponseStatus(value: unknown): number | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "number" &&
    "ok" in value &&
    value.ok === false &&
    TRANSIENT_HTTP_STATUSES.has(value.status)
  ) {
    return value.status;
  }
  return undefined;
}

function getRetryAfterDelayMs(value: unknown): number | undefined {
  if (typeof value !== "object" || value === null || !("headers" in value)) {
    return undefined;
  }
  const headers = value.headers;
  if (typeof headers !== "object" || headers === null || !("get" in headers)) {
    return undefined;
  }
  const getHeader = headers.get;
  if (typeof getHeader !== "function") return undefined;
  const retryAfter = getHeader.call(headers, "Retry-After");
  if (typeof retryAfter !== "string" || !retryAfter.trim()) return undefined;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const retryAt = Date.parse(retryAfter);
  return Number.isNaN(retryAt) ? undefined : Math.max(0, retryAt - Date.now());
}

function describeFailure(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 2000,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    let retryAfterMs: number | undefined;
    try {
      const result = await fn();
      const status = getTransientResponseStatus(result);
      if (status === undefined) {
        return result;
      }
      retryAfterMs = getRetryAfterDelayMs(result);
      throw new Error(`HTTP ${status}`);
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }

      const delayMs = retryAfterMs ?? baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(
        `[Retry] Request failed: ${describeFailure(error)}. Retrying attempt ${attempt + 1}/${retries} in ${Math.round(delayMs)}ms.`,
      );
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
}