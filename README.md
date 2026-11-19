# Adaptive Learning Server

TypeScript/Mongoose server for the Plan Agent, Learn Agent, authentication, and telemetry. Agent execution is service and CLI based; this repository intentionally has no Plan/Learn/Telemetry HTTP routes.

## Setup

```sh
npm install
cp .env.example .env  # create from the variables below if no example exists
npm run build
```

Required environment variables:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GEMINI_API_KEY`
- `MONGODB_URI` (a complete `mongodb://` or `mongodb+srv://` connection string; required)

Optional: `PORT` (default `5000`) and `CORS_ORIGIN` (comma-separated allowed origins).

Start the HTTP server with `npm run dev` or `npm start` after a build.

## Interactive Plan Agent CLI

```sh
npm run runner
```

The CLI signs in, clarifies a learning goal, creates and persists a prerequisite DAG, runs adaptive diagnostics, reconciles prior mastery, and launches the Micro-Tutor learning session.

## Tests

```sh
npm test
npm run test-plan-agent
npm run test-learn-agent
npm run test-full-loop
npx tsc --noEmit
```

Tests use deterministic Gemini fetch stubs where network responses are required. No live Gemini key is needed for the offline suite.
