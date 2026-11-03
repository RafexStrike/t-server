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