import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestContext } from "node:test";

export async function useTemporaryJsonl(t: TestContext): Promise<void> {
  const previousPath = process.env.TELEMETRY_JSONL_PATH;
  const directory = await mkdtemp(join(tmpdir(), "telemetry-test-"));
  process.env.TELEMETRY_JSONL_PATH = join(directory, "nested", "telemetry.jsonl");
  t.after(async () => {
    if (previousPath === undefined) delete process.env.TELEMETRY_JSONL_PATH;
    else process.env.TELEMETRY_JSONL_PATH = previousPath;
    await rm(directory, { recursive: true, force: true });
  });
}
