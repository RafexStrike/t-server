# System 1 WML and KST Outer Fringe

## KST Selection Invariant

The Outer Fringe contains only `PENDING` or `IN_PROGRESS` plan nodes whose
immediate prerequisites are all in a satisfied state: `PASSED_IN_DIAGNOSTIC`
or `MASTERED`. A node without prerequisites is immediately eligible. Selection
is deterministic: continue `IN_PROGRESS` work first, then choose the lowest
Bloom level, then sort by concept name. The plan is completed when every node
is either passed in diagnostics or mastered.

Before selection, `syncPriorUserMastery` reconciles unresolved nodes against
durable, cross-plan `UserMastery` records. A score of at least `0.85` credits
the matching plan node as `MASTERED`; the plan owner is verified before any
plan-node read or mutation.

## Synchronous Working Memory Load

System 1 computes load locally without an LLM call. Every component is clamped
to `[0, 1]`:

- Intrinsic: `0.50 * bloomFactor + 0.30 * directPrereqFactor + 0.20 * transitiveDepthFactor`.
- Bloom factor: `(bloomLevel - 1) / 5`.
- Direct prerequisite factor: `directPrerequisiteCount / 4`.
- Transitive depth factor: `transitiveAncestorCount / 8`.
- Extrinsic: `0.30 * sentenceLengthFactor + 0.30 * lexicalDensityFactor + 0.20 * codeDensityFactor + 0.20 * novelTermFactor`.
- Total WML: `0.55 * intrinsic.score + 0.45 * extrinsic.score`.

Sentence length is normalized against 25 words; lexical density against a
complex-word ratio of `0.45`; code density against a code ratio of `0.35`; and
novel unmastered concepts against three mentioned concepts. The default learner
capacity threshold is `0.70` and can be overridden per assessment.

## Pedagogical Gatekeeper

`assessNodeTurnWml` evaluates a proposed turn before it reaches the Micro-Tutor
prompt. Its `scaffoldingDirectives` are constraints for that prompt: high or
overloaded turns receive the applicable atomic-step, analogy, brevity, code,
and novel-term restrictions; overloaded turns additionally end with one
low-friction check-for-understanding question. Low-load turns instead invite a
concise synthesis and an applied micro-problem. The caller should inject these
directives into the Micro-Tutor instruction context before generation.

Structured `[Learn Agent][KST]` and `[Learn Agent][System 1]` logs report
frontier candidates, load scores, classification, and active scaffolding so
thresholds can be calibrated from runtime behavior.