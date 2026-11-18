import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./modules/auth/routes/auth-routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
  credentials: true,
}));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running!" });
});

export default app;
