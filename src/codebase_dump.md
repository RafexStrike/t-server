# Codebase Dump



---
## FILE: app.ts

```ts
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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
| `userId` | String or ObjectId | Required owner identifier. The schema validates that it is one of these two forms. |
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
## FILE: modules/plan-agent/models/Plan.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

/**
 * A plan can be associated with an ObjectId-backed account or with an
 * application-level string identifier. Keep this union aligned with the
 * identity representation used by the calling application.
 */
export type PlanUserId = string | Types.ObjectId;

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
  userId: PlanUserId;
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
      // Mixed is used because this boundary explicitly supports both common
      // identity forms; the validator keeps arbitrary values out of the DB.
      type: Schema.Types.Mixed,
      required: [true, "A plan must belong to a user"],
      validate: {
        validator: (value: unknown): value is PlanUserId =>
          typeof value === "string" || value instanceof Types.ObjectId,
        message: "userId must be a string or a MongoDB ObjectId",
      },
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
## FILE: modules/plan-agent/services/clarify-service.ts

```ts
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
  userMessage: string,
  currentSlots: LearningSlots,
  apiKey: string,
): Promise<SlotEvaluationResult> {
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
```


---
## FILE: modules/plan-agent/services/diagnostic-engine.ts

```ts
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
): Promise<PlanNodeDocument | null> {
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
): Promise<void> {
  if (!Types.ObjectId.isValid(nodeId)) {
    throw new Error(`Invalid PlanNode id: ${nodeId}`);
  }

  const node = await PlanNode.findById(nodeId);
  if (!node) {
    throw new Error(`PlanNode not found: ${nodeId}`);
  }

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
import { generateAbsoluteMasteryGraph } from "./graph-generator.js";
import { pruneGraph } from "../utils/graph-pruner.js";

/**
 * Generates and stores a user's requested learning plan and its prerequisite
 * nodes. Graph generation remains separate from persistence and pruning.
 */
export async function createLearningPlan(
  userId: string,
  topic: string,
  targetDepth: number,
  apiKey: string,
) {
  console.log(`[Plan Agent] Fetching absolute mastery graph for "${topic}".`);
  const rawGraph = await generateAbsoluteMasteryGraph(topic, apiKey);

  console.log(`[Plan Agent] Pruning graph to Bloom level ${targetDepth}.`);
  const prunedGraph = pruneGraph(rawGraph, targetDepth);
  console.log(
    `[Plan Agent] Graph pruning complete: ${rawGraph.length} raw nodes, ${prunedGraph.length} retained nodes, ${rawGraph.length - prunedGraph.length} pruned.`,
  );

  const plan = new Plan({
    userId,
    topic,
    targetDepth,
    status: "DIAGNOSTIC_IN_PROGRESS",
  });
  await plan.save();
  console.log(`[Plan Agent] Plan created: ${plan._id.toString()}.`);

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

  await PlanNode.insertMany(nodesToInsert);
  console.log(`[Plan Agent] Inserted ${nodesToInsert.length} PlanNode documents.`);

  return plan;
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
