# LLM System Context (For Next Chat Session)

## Project Vision & Architecture
This project is an autonomous Educational Harness built in Node.js/TypeScript. It manages learner memory and pedagogical progression using cognitive science frameworks. The architecture is inspired by Kahneman's Dual-Process Theory:
*   **System 1:** A fast, synchronous interceptor that acts as a Working Memory Load (WML) meter. It calculates Extrinsic Load (text complexity) and Intrinsic Load (graph density) in real-time.
*   **System 2:** An asynchronous analyzer that calculates the Paas & Van Merriënboer Cognitive Efficiency to set baseline capacity and update long-term mastery.

The system is divided into two main agents:
1.  **Plan Agent (Fully Implemented in Backend Services):** Handles intent scoping, curriculum graph generation, and diagnostic testing.
2.  **Learn Agent:** Executes the Micro-Tutor loop with synchronous WML gating and System 2 capacity/mastery updates.

## Current Progress: Plan Agent Completion
The Plan Agent has been fully implemented at the service/module level. It relies on the following theoretical implementations:
1.  **Ambiguity Guard (ClarifyAgent):** Uses a slot-tracking module to prevent the LLM from generating a graph for overly broad prompts (requires Language, Subdomain, and Target Depth).
2.  **Absolute Mastery Graph Generation:** Forces the LLM (`gemini-3.1-flash-lite`) to generate a complete Level 6 (Bloom's Taxonomy) Directed Acyclic Graph (DAG), working backward from absolute mastery to foundational axioms.
3.  **Ancestral Subgraph Pruning:** Mathematically prunes the graph down to the user's requested depth, removing orphaned nodes using Graph Theory reachability.
4.  **Database Persistence:** Saves the DAG to MongoDB using a strict Parent-Referencing pattern (`prerequisites` array of ObjectIds) to allow recursive `$graphLookup`.
5.  **Adaptive Diagnostic Engine:** Uses Knowledge Space Theory (KST) and an approximation of Shannon Entropy (Topological Median Search) to ask adaptive questions. Passing a node recursively invalidates pending ancestors as "known"; failing recursively invalidates descendants as "unknown".

## Implementation Notes

- Node states are `PENDING`, `PASSED_IN_DIAGNOSTIC`, `QUEUED`, `IN_PROGRESS`, and `MASTERED`.
- Ontology Grounding runs between ambiguity resolution and graph generation.
- Prerequisite cycles are broken before sink detection and ancestor traversal.
- Prior `UserMastery` reconciliation runs immediately after persisting a new plan, before diagnostics.
- Cross-plan capacity is stored only on `User.capacityThreshold`; Plan-level capacity is snapshot-only.
- Agent execution is through services and `src/modules/plan-agent/runner/plan-runner.ts`; no Agent HTTP routes are added.