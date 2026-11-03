import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  MONGODB_USERNAME: getEnv("MONGODB_USERNAME"),
  MONGODB_PASSWORD: getEnv("MONGODB_PASSWORD"),
  MONGODB_URI: getEnv("MONGODB_URI"),

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),

  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
} as const;