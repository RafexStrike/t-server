# Learn Agent Architecture

## Pipeline

1. `prepareNodeLesson` loads the active plan node and authoritative `User.capacityThreshold`.
2. It runs the System 1 intrinsic/pre-gate and generates a concise Micro-Tutor lesson and check question.
3. System 1 measures synchronous Working Memory Load (WML) and regenerates once with simplification if extrinsic load exceeds the learner's budget.
4. `submitNodeAttempt` grades the answer, persists an `AttemptLog`, appends the assessment WML to `PlanNode.wmlSamples`, and updates durable mastery.
5. System 2 computes Paas cognitive efficiency and adapts `User.capacityThreshold` within the 0.45–0.90 range.

## Working Memory Load

Intrinsic load combines Bloom level, direct prerequisite count, and transitive ancestor depth:

- Bloom factor, direct-prerequisite factor, and transitive-depth factor are each bounded 0–1.
- Intrinsic score is `0.50*bloom + 0.30*directPrereq + 0.20*depth`.

Extrinsic load combines average sentence length, lexical density, code density, and matched unmastered concepts. Code density uses fenced-code line density and bounded structural punctuation density rather than raw code characters, keeping concise 3–6 line examples moderate.

Total WML is `0.55*intrinsic + 0.45*extrinsic`. The load is LOW below 0.35, OPTIMAL through the learner threshold, HIGH through threshold + 0.15, and OVERLOADED above threshold.

## System 2 adaptation

Cognitive efficiency uses performance and average WML. Mastery on attempt 1, 2, or later attempts contributes progressively lower durability. Successful high-efficiency attempts can raise capacity by 0.03; difficult mastery can lower it by 0.04. `User.capacityThreshold` is authoritative; `Plan.capacityThreshold`, if retained, is only a legacy snapshot and is not mutated at runtime.

## Repeated-failure recovery

After three consecutive failed attempts, the CLI offers backtracking to an unmastered prerequisite, deferral to `QUEUED`, or retry with simplified scaffolding. Backtracking resumes the prerequisite through the Outer Fringe before returning to the original node.
