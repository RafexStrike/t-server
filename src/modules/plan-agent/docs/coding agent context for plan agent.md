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