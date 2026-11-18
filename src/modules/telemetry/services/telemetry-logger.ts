import { appendFile, mkdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import mongoose from "mongoose";
import { TelemetryEvent } from "../models/TelemetryEvent.js";
import type { TelemetryEventInput } from "../models/TelemetryEvent.js";

const processSessionId = randomUUID();

export function getTelemetryJsonlPath(): string {
  return resolve(process.env.TELEMETRY_JSONL_PATH?.trim() || "logs/telemetry.jsonl");
}

export async function recordTelemetryEvent(
  event: TelemetryEventInput,
): Promise<void> {
  const persistedEvent = {
    ...event,
    ...(event.conceptKey
      ? { conceptKey: event.conceptKey.trim().replace(/\s+/g, " ").toLowerCase() }
      : {}),
    sessionId: event.sessionId ?? processSessionId,
  };
  const timestamp = new Date().toISOString();

  if (mongoose.connection.readyState === 1) {
    try {
      await TelemetryEvent.create(persistedEvent);
    } catch (error) {
      console.error(
        `[Telemetry] MongoDB write failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  try {
    const path = getTelemetryJsonlPath();
    await mkdir(dirname(path), { recursive: true });
    await appendFile(
      path,
      `${JSON.stringify({ timestamp, ...persistedEvent })}\n`,
      "utf8",
    );
  } catch (error) {
    console.error(
      `[Telemetry] JSONL append failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function countTelemetryEvents(params: {
  agent: TelemetryEventInput["agent"];
  eventType: string;
  planId: string;
}): Promise<number> {
  if (mongoose.connection.readyState === 1) {
    try {
      return await TelemetryEvent.countDocuments({
        agent: params.agent,
        eventType: params.eventType,
        planId: params.planId,
      });
    } catch (error) {
      console.error(
        `[Telemetry] MongoDB count failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  try {
    const content = await readFile(getTelemetryJsonlPath(), "utf8");
    return content
      .split("\n")
      .filter(Boolean)
      .reduce((count, line) => {
        try {
          const event = JSON.parse(line) as {
            agent?: string;
            eventType?: string;
            planId?: string | { toString(): string };
          };
          return event.agent === params.agent &&
            event.eventType === params.eventType &&
            event.planId?.toString() === params.planId
            ? count + 1
            : count;
        } catch {
          return count;
        }
      }, 0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(
        `[Telemetry] JSONL read failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return 0;
  }
}
