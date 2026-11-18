import { validateEnv } from "./config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "./config/db.js";
import app from "./app.js";

const config = validateEnv();
const PORT = Number(config.PORT ?? "5000");

await connectToDatabase(config.MONGODB_URI);
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}; shutting down gracefully.`);
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await disconnectFromDatabase();
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
