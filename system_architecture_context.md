# AI Educational Harness: System Architecture & Context

## 1. Project Overview
We are building a highly modular, backend-only (terminal-based) AI Educational Harness. The system operates not as a simple chat wrapper, but as an execution environment governed by cognitive and educational theories. 

The harness is divided into two primary agents:
*   **Plan Agent (Current Focus):** Diagnoses the user's intent, creates a mathematically sound curriculum graph (To-Do list), and tests the user's baseline knowledge.
*   **Learn Agent (Future Phase):** Executes the plan using Working Memory Load (WML) constraints and pedagogical gatekeeping.

**Current Objective:** We are exclusively focusing on implementing the **Plan Agent** module from scratch. All user interactions will be simulated or handled via terminal/console outputs for now, without a frontend.

## 2. Tech Stack
*   **Environment:** Node.js, Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB via Mongoose (NoSQL)
*   **LLM API:** Google Gemini (`gemini-3.1-flash-lite`). 
    *   *Crucial Constraint:* We are using the free tier. Do not use the official Google Generative AI SDK. You must make direct HTTP `POST` requests to the REST API using standard `fetch` or similar native HTTP clients.
    *   *Endpoint format:* `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`

## 3. The Plan Agent Flow
The Plan Agent follows a strict 5-step pipeline. It must not generate arbitrary lesson plans; it must construct a mathematically verifiable Directed Acyclic Graph (DAG) of prerequisites.

### Step 1: Ambiguity Check (ClarifyAgent Framework)
*   **Purpose:** Prevent the LLM from hallucinating massive graphs for vague queries like "Learn JavaScript".
*   **Mechanism:** Acts as a slot-tracker. It checks if the user's prompt defines a specific topic and a target depth (Bloom's Taxonomy Level 1-6). If ambiguous, the agent asks targeted follow-up questions in the terminal until the slots are filled.

### Step 2: Ontology Grounding (Simple)
*   **Purpose:** Establish a model-independent "Source of Truth" to prevent the LLM from inventing fake prerequisite structures.
*   **Mechanism:** A very lightweight, low-token step. The system fetches a canonical topic hierarchy (e.g., via a simple structured LLM prompt asking strictly for established domain ontology, or a mocked external fetch for now) to ground the upcoming graph generation.

### Step 3: Graph Generation (Absolute Mastery)
*   **Purpose:** Build the complete curriculum map.
*   **Mechanism:** The LLM is prompted to assume the user wants **Absolute Mastery (Bloom's Level 6)** of the topic. It works backward (Backward Chaining) to generate every prerequisite node down to foundational basics. It outputs a JSON representation of a Directed Acyclic Graph (DAG), assigning a Bloom's Taxonomy level to each node.

### Step 4: Bloom's Pruning (Ancestral Subgraph Extraction)
*   **Purpose:** Cut down the Absolute Mastery graph to match the user's actual desired depth.
*   **Mechanism:** This is pure TypeScript/Graph Theory logic, *not* an LLM call. The system filters out nodes exceeding the target Bloom level, identifies the new "Sinks" (endpoints), and removes any "Orphan" nodes that no longer lead to the target sinks.

### Step 5: Diagnostic Loop (Knowledge Space Theory)
*   **Purpose:** Determine what the user already knows to prune the graph further.
*   **Mechanism:** Using the pruned DAG (a Partially Ordered Set), the agent performs a "Binary Search"-like operation. It selects a median node and asks a diagnostic question. 
    *   If the user passes: All upstream prerequisite nodes are marked as 'Mastered'.
    *   If the user fails: All downstream dependent nodes are marked as 'Unmastered'.
    *   This loop repeats until baseline knowledge is fully mapped, and the final To-Do list is saved to MongoDB.

## 4. Development Guidelines
*   **Strict Modularization:** Separation of concerns is paramount. Every module (Ambiguity Check, Graph Generator, Pruner, DB models) must live in its own file/folder structure.
*   **Extensive Console Logging:** Because this is terminal-based, heavily use `console.log` to track the state. Output the current step, the state of the graph, entropy calculations, and LLM raw outputs to make debugging easy.
*   **Separation of LLM and DB Logic:** Do not mix Mongoose schema saving logic directly inside LLM API call functions. Extract data, parse it, and then pass it to dedicated database service files.
*   **Documentation:** Every file and major function must include comments explaining *why* it exists in the context of the educational theories mentioned above.