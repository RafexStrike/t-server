import dotenv from "dotenv";

dotenv.config();

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export const env = {
  MONGODB_USERNAME: getOptionalEnv("MONGODB_USERNAME"),
  MONGODB_PASSWORD: getOptionalEnv("MONGODB_PASSWORD"),
  MONGODB_URI: getOptionalEnv("MONGODB_URI"),
  GEMINI_API_KEY: getOptionalEnv("GEMINI_API_KEY"),
  BETTER_AUTH_SECRET: getOptionalEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getOptionalEnv("BETTER_AUTH_URL"),
  PORT: getOptionalEnv("PORT"),
} as const;

export type EnvironmentConfig = typeof env;

function isCompleteMongoUri(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:") &&
      parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

export function validateEnv(config: EnvironmentConfig = env): EnvironmentConfig {
  if (!isCompleteMongoUri(config.MONGODB_URI)) {
    const missing = [
      !config.MONGODB_USERNAME ? "MONGODB_USERNAME" : undefined,
      !config.MONGODB_PASSWORD ? "MONGODB_PASSWORD" : undefined,
    ].filter((key): key is string => key !== undefined);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variable(s): ${missing.join(", ")}. Provide a complete MONGODB_URI to omit these credentials.`,
      );
    }
  }
  return config;
}