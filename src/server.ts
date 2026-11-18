import { validateEnv } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";
import app from "./app.js";

const config = validateEnv();
const PORT = config.PORT ?? "5000";

async function startServer(): Promise<void> {
  await connectToDatabase(config.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
