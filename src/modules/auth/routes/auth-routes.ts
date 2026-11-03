import { Router } from "express";
import { requireAuth } from "../middleware/auth-middleware.js";
import { loginUser, registerUser } from "../services/auth-service.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    res.status(201).json(await registerUser(email, password, typeof name === "string" ? name : undefined));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const status = message.includes("already exists") ? 409 : 400;
    res.status(status).json({ error: message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    res.json(await loginUser(email, password));
  } catch {
    res.status(401).json({ error: "Invalid email or password." });
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default authRouter;