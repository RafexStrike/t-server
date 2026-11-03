import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { verifySessionToken } from "../services/auth-service.js";

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) {
    console.warn("[Auth] Rejected protected request: missing bearer token.");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const userId = verifySessionToken(match[1]);
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Session token contains an invalid user id.");
    }
    const user = await User.findById(userId).select("email");
    if (!user) throw new Error("Session user no longer exists.");

    req.user = { userId: user._id.toString(), email: user.email };
    console.log(`[Auth] Authorized ${req.method} ${req.path} for ${req.user.userId}.`);
    next();
  } catch (error) {
    console.warn(
      `[Auth] Rejected protected request: ${error instanceof Error ? error.message : "invalid token"}.`,
    );
    res.status(401).json({ error: "Unauthorized" });
  }
}