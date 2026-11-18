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