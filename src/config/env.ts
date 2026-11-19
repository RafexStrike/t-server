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
  CORS_ORIGIN: getOptionalEnv("CORS_ORIGIN") ?? "http://localhost:3000",
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
  const missing: string[] = [];
  for (const key of ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "GEMINI_API_KEY"] as const) {
    if (!config[key]) missing.push(key);
  }
  if (!isCompleteMongoUri(config.MONGODB_URI)) missing.push("MONGODB_URI");
  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid required environment variable(s): ${[...new Set(missing)].join(", ")}. MONGODB_URI must be a complete mongodb:// or mongodb+srv:// URI.`,
    );
  }
  return config;
}