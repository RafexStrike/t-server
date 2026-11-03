import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { User } from "../models/User.js";

const scrypt = promisify(scryptCallback);
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

interface SessionClaims {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface PublicUser {
  userId: string;
  email: string;
  name?: string;
}

function getTokenConfig(): { secret: string; issuer: string } {
  const secret = process.env.BETTER_AUTH_SECRET;
  const issuer = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
  }
  if (!issuer) {
    throw new Error("BETTER_AUTH_URL must be configured.");
  }
  return { secret, issuer };
}

function publicUser(user: { _id: unknown; email: string; name?: string }): PublicUser {
  return {
    userId: String(user._id),
    email: user.email,
    ...(user.name ? { name: user.name } : {}),
  };
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, saltText, hashText] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;

  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(hashText, "base64url");
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function signClaims(claims: SessionClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function createSessionToken(userId: string): string {
  const { secret, issuer } = getTokenConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  return signClaims(
    { sub: userId, iss: issuer, iat: issuedAt, exp: issuedAt + SESSION_TTL_SECONDS },
    secret,
  );
}

export async function registerUser(
  email: string,
  password: string,
  name?: string,
): Promise<{ user: PublicUser; sessionToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("A valid email address is required.");
  }
  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters long.");
  }
  getTokenConfig();

  if (await User.exists({ email: normalizedEmail })) {
    throw new Error("An account with this email already exists.");
  }

  try {
    const createdUser = await User.create({
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      ...(name?.trim() ? { name: name.trim() } : {}),
    });
    console.log(`[Auth] Registered user ${createdUser._id.toString()} (${normalizedEmail}).`);
    return {
      user: publicUser(createdUser),
      sessionToken: createSessionToken(createdUser._id.toString()),
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      throw new Error("An account with this email already exists.");
    }
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: PublicUser; sessionToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    console.warn(`[Auth] Rejected login for ${normalizedEmail || "empty email"}.`);
    throw new Error("Invalid email or password.");
  }

  console.log(`[Auth] Login validated for user ${user._id.toString()}.`);
  return {
    user: publicUser(user),
    sessionToken: createSessionToken(user._id.toString()),
  };
}

export function verifySessionToken(token: string): string {
  const { secret, issuer } = getTokenConfig();
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra !== undefined) {
    throw new Error("Invalid session token format.");
  }

  const expectedSignature = createHmac("sha256", secret).update(payload).digest();
  let actualSignature: Buffer;
  try {
    actualSignature = Buffer.from(suppliedSignature, "base64url");
  } catch {
    throw new Error("Invalid session token signature.");
  }
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    throw new Error("Invalid session token signature.");
  }

  let claims: SessionClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionClaims;
  } catch {
    throw new Error("Invalid session token payload.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    typeof claims.sub !== "string" ||
    typeof claims.iss !== "string" ||
    claims.iss !== issuer ||
    !Number.isInteger(claims.iat) ||
    !Number.isInteger(claims.exp) ||
    claims.iat > now + 60 ||
    claims.exp <= now
  ) {
    throw new Error("Session token is expired or has invalid claims.");
  }

  console.log(`[Auth] Session token verified for user ${claims.sub}.`);
  return claims.sub;
}