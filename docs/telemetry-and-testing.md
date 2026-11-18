# Telemetry and Testing

## Dual persistence

`AttemptLog` is persisted in MongoDB for each Micro-Tutor attempt. It stores plan, node, concept, attempt number, prompt/context, learner answer, correctness, WML assessment, and feedback. `TelemetryEvent` and JSONL export logging provide complementary operational traces for diagnostics, WML gating, System 2 evaluation, threshold adjustment, and graph lifecycle events.

The JSONL destination is controlled by the temporary-JSONL test helper or configured telemetry logger. MongoDB records and JSONL events share stable plan/user/node/concept identifiers where applicable.

## Offline tests

- `full-loop.test.ts`: deterministic fetch-stubbed Plan/Learn loop, WML regeneration, attempt persistence, and retry behavior.
- `plan-agent.test.ts`: clarification, graph pruning, cycle handling, plan persistence, and diagnostic propagation.
- `learn-agent.test.ts`: intrinsic/extrinsic load, outer-fringe, cognitive efficiency, and state transitions.
- `telemetry.test.ts`: MongoDB and JSONL telemetry behavior.

Gemini HTTP calls are replaced by queued `fetch` stubs in tests. The suite does not require `GEMINI_API_KEY` for network determinism, while the application startup still requires it as a runtime environment variable.

## Commands

```sh
npm test
npm run test-plan-agent
npm run test-learn-agent
npm run test-full-loop
npx tsc --noEmit
```

## Interactive CLI

Run `npm run runner` to use authentication, plan creation, diagnostics, and Micro-Tutor learning through `src/modules/plan-agent/runner/plan-runner.ts`. The CLI has no HTTP route dependency for agent execution.
