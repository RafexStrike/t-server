# KST and Graph Algorithms

## Plan lifecycle

Plan nodes use a prerequisite DAG and progress through:

`PENDING -> PASSED_IN_DIAGNOSTIC` for diagnosed mastery, or
`PENDING -> QUEUED -> IN_PROGRESS -> MASTERED` for learning. `IN_PROGRESS` is reserved for a node actively started by the Micro-Tutor.

## Ontology Grounding

Before graph generation, `ontology-grounder.ts` asks Gemini to normalize canonical concepts and classify foundational versus advanced tiers. The grounded concept spine and constraints are passed to `generateAbsoluteMasteryGraph` so the generated prerequisite graph follows coherent ordering.

## Graph construction and pruning

`generateAbsoluteMasteryGraph` requests a Bloom 1–6 concept DAG. `graph-pruner.ts`:

1. Filters nodes by target depth and deduplicates canonical names.
2. Breaks prerequisite cycles before sink detection.
3. Finds remaining sink nodes.
4. Traverses prerequisite ancestors backward from every sink.
5. Produces the smallest connected graph at or below the target depth.

Cycle breaking deterministically removes back-edges and verifies that every retained node is root-reachable.

## Adaptive diagnostics

The diagnostic engine scores pending nodes by the balance of unresolved prerequisites and descendants, selecting a balanced information-reduction target. A pass marks the node and converging PENDING/QUEUED ancestors as `PASSED_IN_DIAGNOSTIC`. A fail marks the node and descendants `QUEUED`. The diagnostic budget can also queue remaining pending nodes instead of starting active learning.

## Cross-plan mastery reconciliation

Immediately after a plan and its nodes are persisted, `syncPriorUserMastery` reconciles concepts with durable `UserMastery.masteryScore >= 0.85`. This marks prior-mastered nodes `MASTERED` before diagnostics and remains idempotent for concurrent plans.

## Outer Fringe

The Outer Fringe selects nodes whose prerequisites are all satisfied by `PASSED_IN_DIAGNOSTIC` or `MASTERED`. PENDING, QUEUED, and IN_PROGRESS nodes are eligible learning targets. Only true IN_PROGRESS nodes receive resume priority; QUEUED nodes are ordinary deferred targets.
