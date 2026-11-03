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

function describeFailure(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 2000,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const result = await fn();
      const status = getTransientResponseStatus(result);
      if (status === undefined) {
        return result;
      }
      throw new Error(`HTTP ${status}`);
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(
        `[Retry] Request failed: ${describeFailure(error)}. Retrying attempt ${attempt + 1}/${retries} in ${Math.round(delayMs)}ms.`,
      );
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
}