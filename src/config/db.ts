import "dotenv/config";
import mongoose from "mongoose";

/**
 * Opens the shared Mongoose connection used by the backend. Keeping connection
 * lifecycle code outside models ensures persistence setup is not coupled to
 * schema definitions or LLM/agent logic.
 */
export async function connectToDatabase(
  uri: string | undefined = process.env.MONGODB_URI,
): Promise<typeof mongoose> {
  if (!uri?.trim()) {
    const message =
      "[Database] Connection cannot start: MONGODB_URI is missing or empty.";
    console.error(message);
    throw new Error(message);
  }

  if (mongoose.connection.readyState === 1) {
    console.log(
      `[Database] Connection already established (database: ${mongoose.connection.name || "unknown"}). Reusing it.`,
    );
    return mongoose;
  }

  console.log(
    "[Database] Starting MongoDB connection attempt with the configured MONGODB_URI...",
  );

  try {
    await mongoose.connect(uri);
    console.log(
      `[Database] MongoDB connection established successfully (host: ${mongoose.connection.host || "unknown"}, database: ${mongoose.connection.name || "unknown"}).`,
    );
    return mongoose;
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    console.error(
      `[Database] MongoDB connection failed. Verify the URI, network access, and database availability. Details: ${details}`,
    );
    throw error;
  }
}

/** Closes the shared connection cleanly during shutdown or test teardown. */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    console.log("[Database] Disconnect requested, but no connection is open.");
    return;
  }

  console.log("[Database] Closing the MongoDB connection...");
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB connection closed successfully.");
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    console.error(
      `[Database] Failed to close the MongoDB connection. Details: ${details}`,
    );
    throw error;
  }
}

export default connectToDatabase;