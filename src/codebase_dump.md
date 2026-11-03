# Codebase Dump



---
## FILE: app.ts

```ts
import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/routes/auth-routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!"
  });
});

export default app;

```


---
## FILE: config/db.ts

```ts
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
```


---
## FILE: config/env.ts

```ts
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
```


---
## FILE: modules/auth/docs/AUTH_AND_PERSONALIZATION.md

```md
# Authentication and Personalization

## Account Model

`User` stores a normalized, unique email address, an optional display name, a
scrypt password hash, and Mongoose timestamps. Passwords are never stored or
returned in plaintext. Password hashes use a per-user random salt and the
Node.js `scrypt` key-derivation function. The hash field is excluded from
ordinary Mongoose queries; login explicitly selects it for verification.

## Token Lifecycle

Registration and login return `{ user, sessionToken }`. The token is a
signed, base64url-encoded set of claims containing the user ObjectId, configured
`BETTER_AUTH_URL` issuer, issue time, and expiration time. It is authenticated
with HMAC-SHA-256 using `BETTER_AUTH_SECRET` and expires after seven days.
`verifySessionToken` checks the signature in constant time, issuer, claim
types, issue time, and expiry, then returns the user ID. The API middleware
also confirms that the referenced account still exists before authorizing a
request.

The current token is stateless: there is no server-side refresh or revocation
store. Logging out means deleting the client token; a token already issued
remains usable until expiry unless the user's account is removed or the signing
secret is rotated. Keep the secret private and consistent across server
instances. `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `MONGODB_URI` must be
configured in the server environment.

## API Authorization

The app mounts `/api/auth/register` and `/api/auth/login` for account creation
and sign-in. Both accept JSON with `email` and `password`; registration also
accepts `name`. These endpoints return the public user shape and session token.
Protected endpoints use `requireAuth` and accept:

```http
Authorization: Bearer <sessionToken>
```

The middleware verifies the token, resolves the User record, and attaches
`req.user = { userId, email }`. Missing, malformed, expired, or invalid tokens
receive `401 Unauthorized`. Route handlers must use `req.user.userId` as their
ownership boundary and must not accept a client-supplied owner ID.

## User-Scoped Plan Data

`Plan.userId` is a required ObjectId reference to `User`. Plan creation checks
that the authenticated user ID is a valid ObjectId and that the account exists
before graph generation or persistence. Each DAG node references its plan by
`planId`; therefore, plan ownership is the ownership boundary for all its
nodes. Diagnostic selection and answer processing require both plan/node IDs
and the authenticated user ID, then verify the plan owner before reading or
mutating nodes.

Clarification state is stored in `UserLearningSlots`, with one unique record
per user. `evaluateUserIntent(userId, message, apiKey)` loads that user's saved
slots, evaluates the new message, and persists the resulting slot values.
`getUserLearningSlots(userId)` retrieves only the requested account's state.
This keeps separate users' goals independent across API calls and process
restarts.

## Terminal Runner

Run `npm run runner`. The CLI connects through `config/db.ts`, validates a
session token stored in `~/.plan-agent-session.json`, and asks the user to log
in or register if the local token is missing or invalid. The token file is
written with owner-only permissions. The runner lists only the signed-in
user's active plans, persists clarification turns for that account, creates a
user-owned plan and DAG, and passes the same user ID to each diagnostic read
and write. Remove the local session file to sign out; server-side token expiry
and secret rotation work the same as for API clients.

The Gemini integration additionally requires `GEMINI_API_KEY`. The CLI should
be run in a trusted local environment; its password prompt uses the terminal's
standard input, so use a private terminal session.
```


---
## FILE: modules/auth/middleware/auth-middleware.ts

```ts
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
```


---
## FILE: modules/auth/models/User.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = Model<UserDocument>;

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const User: UserModel =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<UserDocument, UserModel>("User", UserSchema);

export default User;
```


---
## FILE: modules/auth/routes/auth-routes.ts

```ts
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
```


---
## FILE: modules/auth/services/auth-service.ts

```ts
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
```


---
## FILE: modules/plan-agent/docs/DIAGNOSTIC_ALGORITHM.md

```md
# Adaptive Diagnostic Algorithm

The diagnostic engine selects a pending concept by counting its pending
transitive prerequisites and pending transitive dependents. It minimizes
`abs(pendingAncestors - pendingDescendants)`, choosing a node with a balanced
number of unresolved concepts on either side. Each candidate's counts and
score are logged to make selection debuggable.

This is a count-based approximation of Shannon entropy reduction: if the
possible known/unknown outcomes are treated as similarly likely, a question
that divides the unresolved prerequisite graph into balanced groups is
expected to reduce uncertainty more than one near either end. It is a
heuristic, not an exact entropy calculation; DAG branching and overlapping
closures can make the groups' actual probabilities unequal.

The propagation rules encode the Knowledge Space Theory assumptions used by
this simplified model:

- Passing a concept marks its pending ancestors as
  `PASSED_IN_DIAGNOSTIC`, because prerequisites of a concept the user knows
  are assumed known as well.
- Failing a concept marks its pending descendants as `IN_PROGRESS`, because a
  concept that depends on something the user does not know is assumed unknown
  and should remain in the learning plan.

Both traversals follow the full plan graph, including already resolved
intermediate nodes, but only alter nodes that are currently `PENDING`.
```


---
## FILE: modules/plan-agent/docs/LLM context for plan agent.md

```md
# LLM System Context (For Next Chat Session)

## Project Vision & Architecture
This project is an autonomous Educational Harness built in Node.js/TypeScript. It manages learner memory and pedagogical progression using cognitive science frameworks. The architecture is inspired by Kahneman's Dual-Process Theory:
*   **System 1:** A fast, synchronous interceptor that acts as a Working Memory Load (WML) meter. It calculates Extrinsic Load (text complexity) and Intrinsic Load (graph density) in real-time.
*   **System 2:** An asynchronous analyzer that calculates the Paas & Van Merriënboer Cognitive Efficiency to set baseline capacity and update long-term mastery.

The system is divided into two main agents:
1.  **Plan Agent (Fully Implemented in Backend Services):** Handles intent scoping, curriculum graph generation, and diagnostic testing.
2.  **Learn Agent (Pending):** Executes the actual pedagogical loop by spawning recursive Sub-Agents to teach the nodes generated by the Plan Agent.

## Current Progress: Plan Agent Completion
The Plan Agent has been fully implemented at the service/module level. It relies on the following theoretical implementations:
1.  **Ambiguity Guard (ClarifyAgent):** Uses a slot-tracking module to prevent the LLM from generating a graph for overly broad prompts (requires Language, Subdomain, and Target Depth).
2.  **Absolute Mastery Graph Generation:** Forces the LLM (`gemini-3.1-flash-lite`) to generate a complete Level 6 (Bloom's Taxonomy) Directed Acyclic Graph (DAG), working backward from absolute mastery to foundational axioms.
3.  **Ancestral Subgraph Pruning:** Mathematically prunes the graph down to the user's requested depth, removing orphaned nodes using Graph Theory reachability.
4.  **Database Persistence:** Saves the DAG to MongoDB using a strict Parent-Referencing pattern (`prerequisites` array of ObjectIds) to allow recursive `$graphLookup`.
5.  **Adaptive Diagnostic Engine:** Uses Knowledge Space Theory (KST) and an approximation of Shannon Entropy (Topological Median Search) to ask adaptive questions. Passing a node recursively invalidates pending ancestors as "known"; failing recursively invalidates descendants as "unknown".

## Next Steps for the LLM
1.  **Wire the Plan Agent API:** The core services are written, but they need to be wired together in a central orchestration loop (either Express controllers or a terminal-based REPL loop) to execute the end-to-end flow.
2.  **Begin the Learn Agent:** Once the Plan Agent orchestrator is wired, we must implement Step 6 (NLP Extraction / WML Calculation for System 1) and Step 7 (Async Worker for System 2).
```


---
## FILE: modules/plan-agent/docs/PLAN_AGENT_DB_SCHEMA.md

```md
# Plan Agent Database Schema

This document describes the Plan Agent's persisted learning plan, prerequisite
graph, and cross-plan mastery estimate. The schemas live in separate model
files so graph construction, user diagnostics, and database lifecycle code can
evolve independently.

## Model Overview

### `Plan`

`Plan` is the lifecycle record for one requested learning outcome.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `userId` | ObjectId reference to `User` | Required authenticated account that owns the plan. |
| `topic` | String | Required, trimmed subject of the plan. |
| `targetDepth` | Number | Required integer from 1 through 6, corresponding to the target Bloom level. |
| `status` | Enum | `DIAGNOSTIC_IN_PROGRESS`, `READY`, or `COMPLETED`; new plans begin in diagnostic. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

The compound `{ userId, status, updatedAt }` index supports listing a user's
active plans and recent plan history.

### `PlanNode`

`PlanNode` is one concept in a plan's curriculum DAG. `planId` points to its
owning `Plan`, while `prerequisites` contains ObjectIds of the node's immediate
prerequisites. A node with no prerequisites is a foundational concept.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `planId` | ObjectId reference to `Plan` | Required owning plan. |
| `conceptName` | String | Required, trimmed concept label. |
| `bloomLevel` | Number | Required integer from 1 through 6. |
| `status` | Enum | `PASSED_IN_DIAGNOSTIC`, `PENDING`, `IN_PROGRESS`, or `MASTERED`; new nodes begin pending. |
| `prerequisites` | ObjectId[] references to `PlanNode` | Immediate prerequisite nodes. Defaults to an empty array. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

Indexes support listing nodes within a plan by Bloom level and locating nodes
that reference a given prerequisite. Application-level graph creation must
ensure prerequisite IDs belong to the same plan and do not introduce cycles;
MongoDB references do not enforce either invariant automatically.

### `UserMastery`

`UserMastery` stores a durable mastery estimate across plans. It is not tied to
a plan's temporary diagnostic state.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `userId` | String | Required external/application identity. |
| `conceptName` | String | Required trimmed concept key. |
| `masteryScore` | Number | Required value from `0.0` through `1.0`. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

A unique `{ userId, conceptName }` index provides one current mastery estimate
per user and concept and supports deterministic upserts. Callers should use a
consistent spelling/canonicalization strategy for concept names.

## Why Parent Referencing

The DAG is represented with **parent referencing**: each node stores IDs of
its prerequisite nodes. In this educational graph, prerequisites are the
parents of a concept because those concepts must be learned before it.

This representation is preferable to child referencing for this workload:

- Adding a prerequisite relationship updates the dependent concept's own
  document, rather than rewriting the prerequisite document's potentially
  large list of dependents.
- The prerequisite set is the data needed to answer the common planning
  question, "What must be mastered before this concept?"
- MongoDB `$graphLookup` can recursively follow `prerequisites` to retrieve a
  node's transitive prerequisite closure without loading the graph into the
  application first.
- Each edge has one authoritative location, avoiding duplicated parent and
  child edge lists that could become inconsistent.

For example, after matching one node, a graph lookup can walk all prerequisite
ancestors. Restricting the lookup to the same `planId` prevents traversal into
another plan if invalid references are accidentally persisted:

```ts
const nodesWithPrerequisites = await PlanNode.aggregate([
  { $match: { _id: nodeId, planId } },
  {
    $graphLookup: {
      from: PlanNode.collection.name,
      startWith: "$prerequisites",
      connectFromField: "prerequisites",
      connectToField: "_id",
      as: "prerequisiteClosure",
      restrictSearchWithMatch: { planId },
    },
  },
]);
```

The graph lookup follows prerequisites upward from the selected concept. To
find downstream concepts unlocked by a mastered node, query nodes whose
`prerequisites` contains that node ID, or use a reverse traversal pipeline.

## How the Models Interact

1. A user starts a plan. `Plan` records the topic, target Bloom depth, and
   `DIAGNOSTIC_IN_PROGRESS` lifecycle status.
2. The Plan Agent creates `PlanNode` documents for the generated and pruned
   curriculum graph. Each node refers to its owning plan and lists its direct
   prerequisite node IDs.
3. During the diagnostic loop, a node's status records the plan-specific
   result. Passing or failing a diagnostic can update the affected nodes
   without changing the reusable `UserMastery` record automatically.
4. Once diagnostic decisions are resolved, the plan can move to `READY`; after
   the learning work is done, it can move to `COMPLETED`. The application
   should define the exact transition rules.
5. Evidence from a completed diagnostic or learning activity can update the
   user's `UserMastery` estimate. Future plans may consult that record to
   initialize node status or prioritize diagnostics, while retaining their
   own per-plan `PlanNode` state.

The models intentionally do not embed node arrays inside `Plan`. Separately
stored nodes avoid an ever-growing plan document, allow indexing/querying
individual concepts, and make graph traversal possible through references.
```


---
## FILE: modules/plan-agent/docs/coding agent context for plan agent.md

```md
# Coding Agent Context (For Next Coding Session)

## Tech Stack & Codebase Rules
*   **Language:** TypeScript (Strict Mode), Node.js, Express 5.3.0
*   **Database:** MongoDB, Mongoose 8.x
*   **LLM API:** `generativelanguage.googleapis.com` (Model: `gemini-3.1-flash-lite`)
*   **Architecture:** Strictly modularized. The `Plan Agent` is isolated in `src/modules/plan-agent/`.

## Current File Tree & Module State
```text
src/
├── app.ts                 (Express setup)
├── server.ts              (Entry point)
├── config/
│   └── db.ts              (Mongoose connection utility)
└── modules/
    └── plan-agent/
        ├── models/
        │   ├── Plan.ts        (Tracks user's learning topic and target depth)
        │   ├── PlanNode.ts    (DAG node, uses `prerequisites: [ObjectId]` for Parent Referencing)
        │   └── UserMastery.ts (Cross-plan durable mastery tracking)
        ├── services/
        │   ├── clarify-service.ts       (Evaluates if user prompt fills all LearningSlots)
        │   ├── graph-generator.ts       (Fetches RawGraphNode[] from Gemini assuming Bloom Level 6)
        │   ├── plan-service.ts          (Prunes graph, maps ObjectIds, and saves to MongoDB)
        │   ├── diagnostic-engine.ts     (Finds topological median: lowest abs(pendingAncestors - pendingDescendants))
        │   └── diagnostic-evaluator.ts  (Updates node statuses and cascades KST logic up/down the DAG)
        ├── types/
        │   ├── graph.ts                 (RawGraphNode interface)
        │   └── slots.ts                 (LearningSlots and SlotEvaluationResult interfaces)
        └── utils/
            ├── clarify-prompts.ts       (System prompt for intent extraction)
            ├── graph-pruner.ts          (Ancestral Subgraph extraction math)
            └── prompt-templates.ts      (System prompt for Absolute Mastery graph)
```


---
## FILE: modules/plan-agent/docs/human context for plan agent.md

```md
# Human / Developer Documentation: Plan Agent Module

## Overview

The Plan Agent is the intelligence engine that runs _before_ any actual teaching begins. Its job is to figure out exactly what you want to learn, break it down into a logical map of prerequisites (a Directed Acyclic Graph), and mathematically determine what you already know so you don't waste time relearning it.

## How It Works (The Lifecycle)

### 1. The Ambiguity Guard (`clarify-service.ts`)

If you tell the system "I want to learn Python," that is too broad. The system will not generate a graph. Instead, it uses a Slot Tracker to ask you clarification questions until it knows:

- **Target Subject:** (e.g., Python)
- **Subdomain:** (e.g., Asynchronous Programming)
- **Target Depth:** (e.g., Level 4 / Analyze on Bloom's Taxonomy)

### 2. The Absolute Mastery Generator (`graph-generator.ts`)

Once your goal is clear, the system asks the LLM to generate a curriculum. To prevent the LLM from missing foundational steps, we force it to assume you want to reach **Level 6 Absolute Mastery** of the topic, and it works backward, breaking the topic down into atomic concepts.

### 3. The Pruning Engine (`graph-pruner.ts`)

Because the LLM generated a Level 6 graph, but you only asked for Level 4, the backend mathematically trims the graph. It uses "Ancestral Subgraph" extraction to remove advanced topics while ensuring no foundational "orphan" topics are left behind.

### 4. Database Persistence (`models/` & `plan-service.ts`)

The pruned graph is saved to MongoDB. We use a **Parent-Referencing** database pattern. Each concept points to the specific concepts you must learn _before_ it. This allows the database to easily traverse the graph later.

### 5. The Diagnostic Loop (`diagnostic-engine.ts` & `diagnostic-evaluator.ts`)

Before teaching begins, the system gives you a diagnostic test.

- **Smart Questioning:** Instead of asking you about every single topic, it finds the "Topological Median" of the graph (the concept exactly in the middle of the curriculum).
- **Knowledge Space Theory:** If you pass the middle concept, the system mathematically proves you must already know the basics, and automatically marks all prior prerequisites as "Known". If you fail, it marks all downstream concepts as "Unknown". This acts like a binary search, cutting your test time in half.

```


---
## FILE: modules/plan-agent/models/Plan.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const PLAN_STATUSES = [
  "DIAGNOSTIC_IN_PROGRESS",
  "READY",
  "COMPLETED",
] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

/**
 * Describes a user's requested learning outcome and the lifecycle of the
 * diagnostic/planning workflow that will produce its curriculum graph.
 */
export interface PlanDocument extends Document {
  userId: Types.ObjectId;
  topic: string;
  targetDepth: number;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanModel = Model<PlanDocument>;

const PlanSchema = new Schema<PlanDocument, PlanModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A plan must belong to a user"],
    },
    topic: {
      type: String,
      required: [true, "A plan topic is required"],
      trim: true,
      minlength: [1, "A plan topic cannot be empty"],
    },
    targetDepth: {
      type: Number,
      required: [true, "A target Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    status: {
      type: String,
      enum: PLAN_STATUSES,
      default: "DIAGNOSTIC_IN_PROGRESS",
      required: true,
    },
  },
  {
    // Lifecycle timestamps make diagnostic and completion events auditable.
    timestamps: true,
    versionKey: false,
  },
);

// Supports a user's active-plan and plan-history queries.
PlanSchema.index({ userId: 1, status: 1, updatedAt: -1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const Plan: PlanModel =
  (mongoose.models.Plan as PlanModel | undefined) ??
  mongoose.model<PlanDocument, PlanModel>("Plan", PlanSchema);

export default Plan;
```


---
## FILE: modules/plan-agent/models/PlanNode.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const PLAN_NODE_STATUSES = [
  "PASSED_IN_DIAGNOSTIC",
  "PENDING",
  "IN_PROGRESS",
  "MASTERED",
] as const;

export type PlanNodeStatus = (typeof PLAN_NODE_STATUSES)[number];

/**
 * One concept in a plan's prerequisite DAG. Each node stores references to
 * its immediate prerequisite nodes; this is the parent-reference edge model
 * used by MongoDB graph traversals.
 */
export interface PlanNodeDocument extends Document {
  planId: Types.ObjectId;
  conceptName: string;
  bloomLevel: number;
  status: PlanNodeStatus;
  prerequisites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type PlanNodeModel = Model<PlanNodeDocument>;

const PlanNodeSchema = new Schema<PlanNodeDocument, PlanNodeModel>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "A plan node must belong to a plan"],
      index: true,
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    bloomLevel: {
      type: Number,
      required: [true, "A Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    status: {
      type: String,
      enum: PLAN_NODE_STATUSES,
      default: "PENDING",
      required: true,
    },
    prerequisites: {
      // A concept can have zero or more immediate prerequisites. Keeping
      // references here supports $graphLookup from a node to its ancestors.
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "PlanNode",
        },
      ],
      default: [],
      validate: {
        validator: (references: Types.ObjectId[]): boolean =>
          references.every((reference) => reference instanceof Types.ObjectId),
        message: "Every prerequisite must be a PlanNode ObjectId",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// These indexes constrain common plan reads and prerequisite-edge lookups.
PlanNodeSchema.index({ planId: 1, bloomLevel: 1 });
PlanNodeSchema.index({ prerequisites: 1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const PlanNode: PlanNodeModel =
  (mongoose.models.PlanNode as PlanNodeModel | undefined) ??
  mongoose.model<PlanNodeDocument, PlanNodeModel>("PlanNode", PlanNodeSchema);

export default PlanNode;
```


---
## FILE: modules/plan-agent/models/UserLearningSlots.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { LearningSlots } from "../types/slots.js";

export interface UserLearningSlotsDocument extends Document {
  userId: Types.ObjectId;
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLearningSlotsModel = Model<UserLearningSlotsDocument>;

const UserLearningSlotsSchema = new Schema<UserLearningSlotsDocument, UserLearningSlotsModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetLanguageOrTool: { type: String, default: null, trim: true },
    specificSubdomain: { type: String, default: null, trim: true },
    targetDepth: { type: Number, default: null, min: 1, max: 6 },
  },
  { timestamps: true, versionKey: false },
);

export const UserLearningSlots: UserLearningSlotsModel =
  (mongoose.models.UserLearningSlots as UserLearningSlotsModel | undefined) ??
  mongoose.model<UserLearningSlotsDocument, UserLearningSlotsModel>(
    "UserLearningSlots",
    UserLearningSlotsSchema,
  );

export function toLearningSlots(record: UserLearningSlotsDocument): LearningSlots {
  return {
    targetLanguageOrTool: record.targetLanguageOrTool,
    specificSubdomain: record.specificSubdomain,
    targetDepth: record.targetDepth,
  };
}

export default UserLearningSlots;
```


---
## FILE: modules/plan-agent/models/UserMastery.ts

```ts
import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Long-lived evidence of a user's mastery, independent of any one generated
 * plan. User IDs are strings here to support external identity providers.
 */
export interface UserMasteryDocument extends Document {
  userId: string;
  conceptName: string;
  masteryScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserMasteryModel = Model<UserMasteryDocument>;

const UserMasterySchema = new Schema<UserMasteryDocument, UserMasteryModel>(
  {
    userId: {
      type: String,
      required: [true, "Mastery evidence must belong to a user"],
      trim: true,
      minlength: [1, "userId cannot be empty"],
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    masteryScore: {
      type: Number,
      required: true,
      min: [0, "Mastery score must be at least 0"],
      max: [1, "Mastery score cannot exceed 1"],
    },
  },
  {
    // Updated timestamps let later plans use the latest mastery evidence.
    timestamps: true,
    versionKey: false,
  },
);

// One current mastery estimate per user/concept pair; upserts can target this key.
UserMasterySchema.index({ userId: 1, conceptName: 1 }, { unique: true });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const UserMastery: UserMasteryModel =
  (mongoose.models.UserMastery as UserMasteryModel | undefined) ??
  mongoose.model<UserMasteryDocument, UserMasteryModel>(
    "UserMastery",
    UserMasterySchema,
  );

export default UserMastery;
```


---
## FILE: modules/plan-agent/runner/plan-runner.ts

```ts
import "dotenv/config";
import { homedir } from "node:os";
import { join } from "node:path";
import { chmod, readFile, unlink, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import {
  loginUser,
  registerUser,
  verifySessionToken,
} from "../../auth/services/auth-service.js";
import { Plan } from "../models/Plan.js";
import {
  clearUserLearningSlots,
  getUserLearningSlots,
  evaluateUserIntent,
} from "../services/clarify-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import { createLearningPlan } from "../services/plan-service.js";

const sessionPath = join(homedir(), ".plan-agent-session.json");
const terminal = createInterface({ input: stdin, output: stdout });

async function authenticate(): Promise<{ userId: string; email: string }> {
  try {
    const saved = JSON.parse(await readFile(sessionPath, "utf8")) as { sessionToken?: unknown };
    if (typeof saved.sessionToken === "string") {
      const userId = verifySessionToken(saved.sessionToken);
      const user = await User.findById(userId).select("email");
      if (user) {
        console.log(`[Runner] Reusing local session for ${user.email}.`);
        return { userId: user._id.toString(), email: user.email };
      }
    }
  } catch {
    console.log("[Runner] No valid local session found; sign-in is required.");
  }
  await unlink(sessionPath).catch(() => undefined);

  while (true) {
    const action = (await terminal.question("[1] Login  [2] Sign Up: ")).trim();
    const email = (await terminal.question("Email: ")).trim();
    const password = await terminal.question("Password: ");
    try {
      const result = action === "2"
        ? await registerUser(email, password, (await terminal.question("Name (optional): ")).trim())
        : await loginUser(email, password);
      await writeFile(sessionPath, JSON.stringify({ sessionToken: result.sessionToken }), {
        encoding: "utf8",
        mode: 0o600,
      });
      await chmod(sessionPath, 0o600);
      console.log(`[Runner] Signed in as ${result.user.email}; local session saved securely.`);
      return { userId: result.user.userId, email: result.user.email };
    } catch (error) {
      console.error(`[Runner] Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function createPlanForUser(userId: string): Promise<string> {
  let evaluation;
  do {
    const message = await terminal.question(
      evaluation?.nextQuestion ? `Clarification: ${evaluation.nextQuestion}\nYou: ` : "Learning goal: ",
    );
    evaluation = await evaluateUserIntent(userId, message, process.env.GEMINI_API_KEY ?? "");
    if (!evaluation.isComplete && evaluation.nextQuestion) {
      console.log(`[Runner] ${evaluation.nextQuestion}`);
    }
  } while (!evaluation?.isComplete);

  const slots = await getUserLearningSlots(userId);
  if (!slots.targetLanguageOrTool || !slots.specificSubdomain || !slots.targetDepth) {
    throw new Error("Clarification completed without all required learning slots.");
  }
  const topic = `${slots.targetLanguageOrTool}: ${slots.specificSubdomain}`;
  const plan = await createLearningPlan(
    userId,
    topic,
    slots.targetDepth,
    process.env.GEMINI_API_KEY ?? "",
  );
  await clearUserLearningSlots(userId);
  return plan._id.toString();
}

async function runDiagnostics(planId: string, userId: string): Promise<void> {
  console.log(`[Runner] Starting diagnostics for plan ${planId} as user ${userId}.`);
  while (true) {
    const node = await getNextDiagnosticNode(planId, userId);
    if (!node) break;
    const answer = (await terminal.question(`Do you already know "${node.conceptName}"? [y/N]: `))
      .trim()
      .toLowerCase();
    await processDiagnosticAnswer(node._id.toString(), answer === "y" || answer === "yes", userId);
  }
  await Plan.updateOne(
    { _id: planId, userId },
    { $set: { status: "READY" } },
  );
  console.log("[Runner] No pending diagnostic nodes remain.");
}

async function main(): Promise<void> {
  await connectToDatabase();
  const { userId, email } = await authenticate();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Authenticated user id is invalid.");

  const activePlans = await Plan.find({
    userId,
    status: { $in: ["DIAGNOSTIC_IN_PROGRESS", "READY"] },
  }).sort({ updatedAt: -1 });
  console.log(`[Runner] ${activePlans.length} active plan(s) for ${email}.`);
  activePlans.forEach((plan, index) => {
    console.log(`  [${index + 1}] ${plan.topic} (${plan.status})`);
  });
  console.log("  [0] Start a new plan");

  const choice = Number((await terminal.question("Choose a plan: ")).trim());
  let planId: string;
  if (choice === 0) {
    planId = await createPlanForUser(userId);
  } else {
    const selected = activePlans[choice - 1];
    if (!selected) throw new Error("Choose one of the listed plans.");
    planId = selected._id.toString();
  }
  await runDiagnostics(planId, userId);
}

try {
  await main();
} catch (error) {
  console.error(`[Runner] Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  terminal.close();
  await disconnectFromDatabase();
}
```


---
## FILE: modules/plan-agent/services/clarify-service.ts

```ts
import { Types } from "mongoose";
import { User } from "../../auth/models/User.js";
import { UserLearningSlots, toLearningSlots } from "../models/UserLearningSlots.js";
import { getClarificationSystemPrompt } from "../utils/clarify-prompts.js";
import type { LearningSlots, SlotEvaluationResult } from "../types/slots.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

function parseSlotEvaluation(text: string): SlotEvaluationResult {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the slot evaluation.", {
      cause: error,
    });
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Gemini slot evaluation must be a JSON object.");
  }

  const result = parsed as Record<string, unknown>;
  const slots = result.slots;
  if (typeof slots !== "object" || slots === null) {
    throw new Error("Gemini slot evaluation must include a slots object.");
  }

  const slotValues = slots as Record<string, unknown>;
  const { targetLanguageOrTool, specificSubdomain, targetDepth } = slotValues;
  if (
    (targetLanguageOrTool !== null && typeof targetLanguageOrTool !== "string") ||
    (specificSubdomain !== null && typeof specificSubdomain !== "string") ||
    (targetDepth !== null &&
      (typeof targetDepth !== "number" ||
        !Number.isInteger(targetDepth) ||
        targetDepth < 1 ||
        targetDepth > 6))
  ) {
    throw new Error("Gemini slot evaluation contains invalid slot values.");
  }

  if (
    typeof result.isComplete !== "boolean" ||
    (result.nextQuestion !== null && typeof result.nextQuestion !== "string")
  ) {
    throw new Error("Gemini slot evaluation contains invalid completion fields.");
  }

  const validatedSlots: LearningSlots = {
    targetLanguageOrTool,
    specificSubdomain,
    targetDepth,
  };
  const hasAllSlots =
    typeof targetLanguageOrTool === "string" &&
    targetLanguageOrTool.trim().length > 0 &&
    typeof specificSubdomain === "string" &&
    specificSubdomain.trim().length > 0 &&
    typeof targetDepth === "number";

  if (result.isComplete !== hasAllSlots) {
    throw new Error("Gemini slot evaluation has an inconsistent isComplete value.");
  }

  if (
    (result.isComplete && result.nextQuestion !== null) ||
    (!result.isComplete &&
      (typeof result.nextQuestion !== "string" || result.nextQuestion.trim().length === 0))
  ) {
    throw new Error("Gemini slot evaluation has an invalid nextQuestion value.");
  }

  return {
    slots: validatedSlots,
    isComplete: result.isComplete,
    nextQuestion: result.nextQuestion,
  };
}

export async function evaluateUserIntent(
  userId: string | Types.ObjectId,
  userMessage: string,
  apiKey: string,
): Promise<SlotEvaluationResult> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required for clarification.");
  }
  const ownerId = new Types.ObjectId(userId);
  if (!(await User.exists({ _id: ownerId }))) {
    throw new Error(`Cannot evaluate clarification: user ${ownerId.toString()} does not exist.`);
  }
  const state = await UserLearningSlots.findOneAndUpdate(
    { userId: ownerId },
    { $setOnInsert: { userId: ownerId } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const currentSlots = toLearningSlots(state);
  console.log(`[Plan Agent] Loaded clarification slots for user ${ownerId.toString()}.`);
  console.log("[Plan Agent] Starting Gemini clarification evaluation.");

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: getClarificationSystemPrompt(currentSlots) }],
      },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  console.log(`[Plan Agent] Gemini clarification fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini clarification request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no slot evaluation content.");
  }

  const evaluation = parseSlotEvaluation(text);
  state.targetLanguageOrTool = evaluation.slots.targetLanguageOrTool;
  state.specificSubdomain = evaluation.slots.specificSubdomain;
  state.targetDepth = evaluation.slots.targetDepth;
  await state.save();
  console.log(`[Plan Agent] Saved clarification slots for user ${ownerId.toString()}.`);
  const missingSlots: string[] = [];
  if (!evaluation.slots.targetLanguageOrTool?.trim()) {
    missingSlots.push("targetLanguageOrTool");
  }
  if (!evaluation.slots.specificSubdomain?.trim()) {
    missingSlots.push("specificSubdomain");
  }
  if (evaluation.slots.targetDepth === null) {
    missingSlots.push("targetDepth");
  }

  console.log(
    `[Plan Agent] Clarification slots missing: ${missingSlots.length > 0 ? missingSlots.join(", ") : "none"}.`,
  );
  console.log(
    `[Plan Agent] Generated clarification question: ${evaluation.nextQuestion ?? "none; slots are complete"}`,
  );

  return evaluation;
}

export async function getUserLearningSlots(
  userId: string | Types.ObjectId,
): Promise<LearningSlots> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to retrieve clarification slots.");
  }
  const ownerId = new Types.ObjectId(userId);
  const record = await UserLearningSlots.findOne({ userId: ownerId });
  return record
    ? toLearningSlots(record)
    : { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null };
}

export async function clearUserLearningSlots(
  userId: string | Types.ObjectId,
): Promise<void> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to clear clarification slots.");
  }
  const ownerId = new Types.ObjectId(userId);
  await UserLearningSlots.updateOne(
    { userId: ownerId },
    {
      $set: {
        targetLanguageOrTool: null,
        specificSubdomain: null,
        targetDepth: null,
      },
    },
  );
  console.log(`[Plan Agent] Cleared consumed clarification slots for user ${ownerId.toString()}.`);
}
```


---
## FILE: modules/plan-agent/services/diagnostic-engine.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([node._id.toString()]);

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): number {
    let count = 0;
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING") {
        count += 1;
      }
      count += visit(prerequisite.prerequisites);
    }
    return count;
  }

  return visit(node.prerequisites);
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([nodeId]);

  function visit(parentId: string): number {
    let count = 0;
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (child?.status === "PENDING") {
        count += 1;
      }
      count += visit(childId);
    }
    return count;
  }

  return visit(nodeId);
}

/** Selects the pending node whose known/unknown closure sizes are most balanced. */
export async function getNextDiagnosticNode(
  planId: string,
  userId: string,
): Promise<PlanNodeDocument | null> {
  if (!Types.ObjectId.isValid(planId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid plan and authenticated user ObjectIds are required for diagnostics.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");
  console.log(`[Plan Agent] Verified diagnostic plan ${planId} belongs to user ${userId}.`);

  const pendingNodes = await PlanNode.find({ planId, status: "PENDING" }).sort({
    conceptName: 1,
  });

  if (pendingNodes.length === 0) {
    console.log(`[Plan Agent] Diagnostic complete for plan ${planId}: no pending nodes.`);
    return null;
  }

  const allNodes = await PlanNode.find({ planId });
  const nodesById = new Map(
    allNodes.map((node) => [node._id.toString(), node] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const node of allNodes) {
    for (const prerequisiteId of node.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(node._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  let selectedNode: PlanNodeDocument | null = null;
  let lowestScore = Number.POSITIVE_INFINITY;

  for (const node of pendingNodes) {
    const pendingAncestors = collectPendingAncestors(node, nodesById);
    const pendingDescendants = collectPendingDescendants(
      node._id.toString(),
      childrenById,
      nodesById,
    );
    const informationScore = Math.abs(pendingAncestors - pendingDescendants);

    console.log(
      `[Plan Agent] Diagnostic information score: "${node.conceptName}"; pendingAncestors=${pendingAncestors}; pendingDescendants=${pendingDescendants}; score=${informationScore}.`,
    );

    if (informationScore < lowestScore) {
      lowestScore = informationScore;
      selectedNode = node;
    }
  }

  console.log(
    `[Plan Agent] Selected diagnostic node: "${selectedNode?.conceptName ?? "none"}" (score=${lowestScore}).`,
  );
  return selectedNode;
}
```


---
## FILE: modules/plan-agent/services/diagnostic-evaluator.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([node._id.toString()]);
  const pendingIds: string[] = [];

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): void {
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING") {
        pendingIds.push(prerequisiteKey);
      }
      visit(prerequisite.prerequisites);
    }
  }

  visit(node.prerequisites);
  return pendingIds;
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([nodeId]);
  const pendingIds: string[] = [];

  function visit(parentId: string): void {
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (!child) {
        continue;
      }
      if (child.status === "PENDING") {
        pendingIds.push(childId);
      }
      visit(childId);
    }
  }

  visit(nodeId);
  return pendingIds;
}

/** Applies a diagnostic result and invalidates dependent knowledge assumptions. */
export async function processDiagnosticAnswer(
  nodeId: string,
  passed: boolean,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(nodeId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid PlanNode and authenticated user ObjectIds are required.");
  }

  const node = await PlanNode.findById(nodeId);
  if (!node) {
    throw new Error(`PlanNode not found: ${nodeId}`);
  }
  if (!(await Plan.exists({ _id: node.planId, userId }))) {
    throw new Error("PlanNode is not owned by the authenticated user.");
  }
  console.log(`[Plan Agent] Verified diagnostic answer owner ${userId} for node ${nodeId}.`);

  const allNodes = await PlanNode.find({ planId: node.planId });
  const nodesById = new Map(
    allNodes.map((planNode) => [planNode._id.toString(), planNode] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const planNode of allNodes) {
    for (const prerequisiteId of planNode.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(planNode._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  const affectedNodeIds = passed
    ? collectPendingAncestors(node, nodesById)
    : collectPendingDescendants(node._id.toString(), childrenById, nodesById);
  const nextStatus = passed ? "PASSED_IN_DIAGNOSTIC" : "IN_PROGRESS";

  node.status = nextStatus;
  await node.save();

  if (affectedNodeIds.length > 0) {
    await PlanNode.updateMany(
      {
        _id: { $in: affectedNodeIds },
        planId: node.planId,
        status: "PENDING",
      },
      { $set: { status: nextStatus } },
    );
  }

  console.log(
    `[Plan Agent] Diagnostic answer ${passed ? "passed" : "failed"} for "${node.conceptName}"; updated ${affectedNodeIds.length} ${passed ? "pending ancestors" : "pending descendants"} to ${nextStatus}.`,
  );
}
```


---
## FILE: modules/plan-agent/services/graph-generator.ts

```ts
import { getAbsoluteMasterySystemPrompt } from "../utils/prompt-templates.js";
import type { RawGraphNode } from "../types/graph.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

function parseGraph(text: string): RawGraphNode[] {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the mastery graph.", {
      cause: error,
    });
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini graph output must be a JSON array.");
  }

  for (const [index, node] of parsed.entries()) {
    if (
      typeof node !== "object" ||
      node === null ||
      typeof node.conceptName !== "string" ||
      typeof node.bloomLevel !== "number" ||
      !Number.isInteger(node.bloomLevel) ||
      node.bloomLevel < 1 ||
      node.bloomLevel > 6 ||
      !Array.isArray(node.prerequisiteNames) ||
      !node.prerequisiteNames.every(
        (prerequisiteName: unknown) => typeof prerequisiteName === "string",
      )
    ) {
      throw new Error(`Gemini graph output contains an invalid node at index ${index}.`);
    }
  }

  return parsed as RawGraphNode[];
}

/**
 * Requests the complete Bloom-6 prerequisite graph; pruning and persistence
 * belong to later Plan Agent stages.
 */
export async function generateAbsoluteMasteryGraph(
  topic: string,
  apiKey: string,
): Promise<RawGraphNode[]> {
  console.log(`[Plan Agent] Starting Gemini graph fetch for topic: ${topic}`);

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: getAbsoluteMasterySystemPrompt(topic) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Generate the absolute mastery prerequisite graph for: ${topic}` }],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  console.log(`[Plan Agent] Gemini graph fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini graph request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no graph content.");
  }

  const graph = parseGraph(text);
  console.log(`[Plan Agent] Gemini graph parsing complete: ${graph.length} concepts.`);
  return graph;
}
```


---
## FILE: modules/plan-agent/services/plan-service.ts

```ts
import mongoose, { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { generateAbsoluteMasteryGraph } from "./graph-generator.js";
import { pruneGraph } from "../utils/graph-pruner.js";

/**
 * Generates and stores a user's requested learning plan and its prerequisite
 * nodes. Graph generation remains separate from persistence and pruning.
 */
export async function createLearningPlan(
  userId: string | Types.ObjectId,
  topic: string,
  targetDepth: number,
  apiKey: string,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to create a learning plan.");
  }
  const ownerId = new Types.ObjectId(userId);
  const owner = await User.exists({ _id: ownerId });
  if (!owner) {
    throw new Error(`Cannot create a learning plan: user ${ownerId.toString()} does not exist.`);
  }
  console.log(`[Plan Agent] Verified plan owner ${ownerId.toString()}.`);

  console.log(`[Plan Agent] Fetching absolute mastery graph for "${topic}".`);
  const rawGraph = await generateAbsoluteMasteryGraph(topic, apiKey);

  console.log(`[Plan Agent] Pruning graph to Bloom level ${targetDepth}.`);
  const prunedGraph = pruneGraph(rawGraph, targetDepth);
  console.log(
    `[Plan Agent] Graph pruning complete: ${rawGraph.length} raw nodes, ${prunedGraph.length} retained nodes, ${rawGraph.length - prunedGraph.length} pruned.`,
  );

  const plan = new Plan({
    userId: ownerId,
    topic,
    targetDepth,
    status: "DIAGNOSTIC_IN_PROGRESS",
  });
  const nodeIdsByName = new Map<string, Types.ObjectId>(
    prunedGraph.map((node) => [node.conceptName, new mongoose.Types.ObjectId()]),
  );

  const nodesToInsert = prunedGraph.map((node) => {
    const prerequisites = node.prerequisiteNames.map((prerequisiteName) => {
      const prerequisiteId = nodeIdsByName.get(prerequisiteName);
      if (!prerequisiteId) {
        throw new Error(
          `Prerequisite "${prerequisiteName}" for "${node.conceptName}" was not present in the pruned graph.`,
        );
      }
      return prerequisiteId;
    });

    return {
      _id: nodeIdsByName.get(node.conceptName),
      planId: plan._id,
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: "PENDING" as const,
      prerequisites,
    };
  });

  await plan.save();
  console.log(`[Plan Agent] Plan ${plan._id.toString()} persisted for user ${ownerId.toString()}.`);
  try {
    await PlanNode.insertMany(nodesToInsert);
    console.log(
      `[Plan Agent] Inserted ${nodesToInsert.length} PlanNode documents for user ${ownerId.toString()}.`,
    );
  } catch (error) {
    await PlanNode.deleteMany({ planId: plan._id });
    await Plan.deleteOne({ _id: plan._id, userId: ownerId });
    throw error;
  }

  return plan;
}
```


---
## FILE: modules/plan-agent/tests/plan-agent.test.ts

```ts
import "dotenv/config";
import test from "node:test";
import assert from "node:assert";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { evaluateUserIntent } from "../services/clarify-service.js";
import { pruneGraph } from "../utils/graph-pruner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { UserLearningSlots } from "../models/UserLearningSlots.js";
import { registerUser, verifySessionToken } from "../../auth/services/auth-service.js";

const apiKey = process.env.GEMINI_API_KEY || "";
let testUserId = "";

test("Plan Agent Integration Test Suite", async (t) => {
  // 1. Ensure Database Connection
  await t.test("Database Connection", async () => {
    await connectToDatabase();
    const registration = await registerUser(
      `plan-agent-test-${Date.now()}@example.test`,
      "integration-test-password",
    );
    testUserId = registration.user.userId;
    assert.strictEqual(verifySessionToken(registration.sessionToken), testUserId);
    assert.strictEqual(true, true, "Database connected successfully");
  });

  // 2. Test Ambiguity Guard (ClarifyService) with light retry logic for 503 spikes
  await t.test("ClarifyService: Handles ambiguous vs scoped queries", async () => {
    if (!apiKey) {
      console.warn("Skipping LLM tests: GEMINI_API_KEY is missing.");
      return;
    }

    let initialEval;
    let attempts = 0;
    while (attempts < 3) {
      try {
        initialEval = await evaluateUserIntent(
          testUserId,
          "I want to learn programming",
          apiKey
        );
        break;
      } catch (err: any) {
        attempts++;
        if (attempts >= 3) throw err;
        console.warn(`[Test] Gemini 503 encountered. Retrying attempt ${attempts + 1}...`);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    assert.strictEqual(initialEval!.isComplete, false, "Ambiguous prompt should not complete slots");
    assert.notStrictEqual(initialEval!.nextQuestion, null, "Should generate a clarification question");

    // Fully scoped prompt
    const finalEval = await evaluateUserIntent(
      testUserId,
      "I want to learn JavaScript DOM manipulation at an application/apply level (Bloom 3)",
      apiKey
    );

    assert.strictEqual(finalEval.isComplete, true, "Fully scoped prompt should complete all slots");
  });

// 3. Test Graph Pruning Math
  await t.test("GraphPruner: Mathematically removes orphans and deep nodes", () => {
    const mockRawGraph = [
      { conceptName: "Variables", bloomLevel: 1, prerequisiteNames: [] },
      { conceptName: "Functions", bloomLevel: 2, prerequisiteNames: ["Variables"] },
      { conceptName: "DOM Events", bloomLevel: 3, prerequisiteNames: ["Functions"] },
      { conceptName: "Custom Framework Architecture", bloomLevel: 6, prerequisiteNames: ["DOM Events"] }, // Pruned: level 6 > target 3
      { conceptName: "Unconnected Basic Math", bloomLevel: 1, prerequisiteNames: ["NonExistentTopic"] } // Pruned: unreachable/orphan
    ];

    const pruned = pruneGraph(mockRawGraph, 3);

    assert.strictEqual(pruned.length, 4, "Should retain exactly 4 reachable connected nodes <= level 3");
    assert.strictEqual(pruned.some(n => n.conceptName === "Custom Framework Architecture"), false, "Level 6 node must be pruned");
    assert.strictEqual(pruned.some(n => n.conceptName === "Unconnected Basic Math"), false, "Unreachable orphan node must be pruned");
  });

  // 4. Test End-to-End Plan Creation & Database Ingestion
  let createdPlanId: string;
  await t.test("PlanService: Creates Plan and Parent-Referenced DAG in MongoDB", async () => {
    if (!apiKey) return;

    await Plan.deleteMany({ userId: testUserId });

    const plan = await createLearningPlan(
      testUserId,
      "JavaScript Basics",
      2, 
      apiKey
    );

    createdPlanId = plan._id.toString();
    assert.notStrictEqual(createdPlanId, null, "Plan ID should be generated");
    assert.strictEqual(plan.topic, "JavaScript Basics");

    const nodes = await PlanNode.find({ planId: plan._id });
    assert.strictEqual(nodes.length > 0, true, "Plan nodes must be inserted into MongoDB");
    
    for (const node of nodes) {
      assert.strictEqual(Array.isArray(node.prerequisites), true, "Prerequisites must be an array of ObjectIds");
    }
  });

  // 5. Test Diagnostic Engine & KST Invalidation
  await t.test("DiagnosticEngine & Evaluator: Topological median and KST cascade", async () => {
    if (!createdPlanId) return;

    const diagnosticNode = await getNextDiagnosticNode(createdPlanId, testUserId);
    
    if (diagnosticNode) {
      assert.strictEqual(diagnosticNode.status, "PENDING", "Selected diagnostic node must be pending");

      await processDiagnosticAnswer(diagnosticNode._id.toString(), true, testUserId);

      const updatedNode = await PlanNode.findById(diagnosticNode._id);
      assert.strictEqual(updatedNode?.status, "PASSED_IN_DIAGNOSTIC", "Node status should update to passed");
    }
  });

  // 6. Teardown
  await t.test("Teardown", async () => {
    if (createdPlanId) {
      await Plan.deleteMany({ userId: testUserId });
      await PlanNode.deleteMany({ planId: createdPlanId });
    }
    await UserLearningSlots.deleteMany({ userId: testUserId });
    await User.deleteOne({ _id: testUserId });
    await disconnectFromDatabase();
  });
});

// Helper mock node generators
function variablesNode(name: string, level: number, prereqs: string[]) {
  return { conceptName: name, bloomLevel: level, prerequisiteNames: prereqs };
}
function functionsNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function domNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function advancedNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function orphanNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
```


---
## FILE: modules/plan-agent/types/graph.ts

```ts
/** A concept and its direct prerequisites in the unpruned mastery graph. */
export interface RawGraphNode {
  conceptName: string;
  bloomLevel: number;
  prerequisiteNames: string[];
}
```


---
## FILE: modules/plan-agent/types/slots.ts

```ts
export interface LearningSlots {
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
}

export interface SlotEvaluationResult {
  slots: LearningSlots;
  isComplete: boolean;
  nextQuestion: string | null;
}
```


---
## FILE: modules/plan-agent/utils/clarify-prompts.ts

```ts
import type { LearningSlots } from "../types/slots.js";

export function getClarificationSystemPrompt(currentSlots: LearningSlots): string {
  return `You extract the user's learning intent into precise slots so a learning plan can be generated.

The required slots are:
- "targetLanguageOrTool": the language, tool, or subject the user wants to learn (for example, "JavaScript").
- "specificSubdomain": the focused area within that subject (for example, "DOM Manipulation"). Use "Full Overview" only when the user explicitly wants to learn everything or requests a broad overview.
- "targetDepth": the desired learning depth as an integer from 1 to 6.

Current slot values:
${JSON.stringify(currentSlots, null, 2)}

Use the user's conversation and these current values to fill or preserve the slots. Ask one concise, useful clarification question for the most important missing slot. A slot is complete only when the subject and subdomain are non-empty strings and targetDepth is an integer from 1 to 6. If all slots are complete, set "isComplete" to true and "nextQuestion" to null. Otherwise set "isComplete" to false and provide the next question as a non-empty string.

Output strictly as valid JSON matching this shape, with no markdown fences or explanatory text:
{
  "slots": {
    "targetLanguageOrTool": string | null,
    "specificSubdomain": string | null,
    "targetDepth": number | null
  },
  "isComplete": boolean,
  "nextQuestion": string | null
}`;
}
```


---
## FILE: modules/plan-agent/utils/graph-pruner.ts

```ts
import type { RawGraphNode } from "../types/graph.js";

/**
 * Retains the new learning outcomes at the requested Bloom depth and exactly
 * the prerequisite ancestors needed to reach those outcomes.
 */
export function pruneGraph(
  rawGraph: RawGraphNode[],
  targetDepth: number,
): RawGraphNode[] {
  const filteredNodes = rawGraph.filter((node) => node.bloomLevel <= targetDepth);
  const nodesByName = new Map(
    filteredNodes.map((node) => [node.conceptName, node]),
  );

  // A node referenced as a prerequisite has a dependent above it, so it is
  // not a finish line. The remaining nodes are sinks in the filtered graph.
  const prerequisiteNames = new Set(
    filteredNodes.flatMap((node) => node.prerequisiteNames),
  );
  const targetSinks = filteredNodes.filter(
    (node) => !prerequisiteNames.has(node.conceptName),
  );

  // Walking prerequisite edges backward from each sink yields its ancestral
  // subgraph; the visited set both deduplicates shared ancestors and stops
  // repeated traversal if malformed input contains a cycle.
  const requiredNames = new Set<string>();
  const visitAncestors = (conceptName: string): void => {
    if (requiredNames.has(conceptName)) {
      return;
    }

    const node = nodesByName.get(conceptName);
    if (!node) {
      return;
    }

    requiredNames.add(conceptName);
    for (const prerequisiteName of node.prerequisiteNames) {
      visitAncestors(prerequisiteName);
    }
  };

  for (const sink of targetSinks) {
    visitAncestors(sink.conceptName);
  }

  return filteredNodes.filter((node) => requiredNames.has(node.conceptName));
}
```


---
## FILE: modules/plan-agent/utils/prompt-templates.ts

```ts
/**
 * Builds the instruction that anchors graph generation in absolute mastery,
 * so later pruning can select the user's requested learning depth.
 */
export function getAbsoluteMasterySystemPrompt(topic: string): string {
  return `You are generating a prerequisite knowledge graph for the topic: "${topic}".

Assume the user wants Absolute Mastery of this topic, corresponding to Bloom's Taxonomy Level 6 (Create). Work backward from that outcome and include the atomic concepts and foundational prerequisites needed to reach it.

Return a JSON array of concept objects. Every object must have exactly these fields:
- "conceptName": a concise, distinct string naming one atomic concept
- "bloomLevel": an integer from 1 to 6 representing the mastery level for that concept
- "prerequisiteNames": an array of strings containing the exact conceptName values of its direct prerequisites in this array

Include all prerequisite concepts in the same array. Ensure prerequisite references use exact names from the array and the relationships form a directed acyclic graph. Output strictly valid JSON only, with no markdown fences or explanatory text.`;
}
```


---
## FILE: server.ts

```ts
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```
