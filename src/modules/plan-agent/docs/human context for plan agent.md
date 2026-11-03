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
