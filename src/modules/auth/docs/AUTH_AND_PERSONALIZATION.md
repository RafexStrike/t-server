# Authentication and Personalization

## Account Model

`User` stores a normalized, unique email address, an optional display name, a
scrypt password hash, and Mongoose timestamps. Passwords are never stored or
returned in plaintext. Password hashes use a per-user random salt and the
Node.js `scrypt` key-derivation function. The hash field is excluded from
ordinary Mongoose queries; login explicitly selects it for verification.

## Token Lifecycle

Registration and login return `{ user, sessionToken }`. The token is a
signed, base64url-encoded set of claims containing the user ObjectId, configured
`BETTER_AUTH_URL` issuer, issue time, and expiration time. It is authenticated
with HMAC-SHA-256 using `BETTER_AUTH_SECRET` and expires after seven days.
`verifySessionToken` checks the signature in constant time, issuer, claim
types, issue time, and expiry, then returns the user ID. The API middleware
also confirms that the referenced account still exists before authorizing a
request.

The current token is stateless: there is no server-side refresh or revocation
store. Logging out means deleting the client token; a token already issued
remains usable until expiry unless the user's account is removed or the signing
secret is rotated. Keep the secret private and consistent across server
instances. `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `MONGODB_URI` must be
configured in the server environment.

## API Authorization

The app mounts `/api/auth/register` and `/api/auth/login` for account creation
and sign-in. Both accept JSON with `email` and `password`; registration also
accepts `name`. These endpoints return the public user shape and session token.
Protected endpoints use `requireAuth` and accept:

```http
Authorization: Bearer <sessionToken>
```

The middleware verifies the token, resolves the User record, and attaches
`req.user = { userId, email }`. Missing, malformed, expired, or invalid tokens
receive `401 Unauthorized`. Route handlers must use `req.user.userId` as their
ownership boundary and must not accept a client-supplied owner ID.

## User-Scoped Plan Data

`Plan.userId` is a required ObjectId reference to `User`. Plan creation checks
that the authenticated user ID is a valid ObjectId and that the account exists
before graph generation or persistence. Each DAG node references its plan by
`planId`; therefore, plan ownership is the ownership boundary for all its
nodes. Diagnostic selection and answer processing require both plan/node IDs
and the authenticated user ID, then verify the plan owner before reading or
mutating nodes.

Clarification state is stored in `UserLearningSlots`, with one unique record
per user. `evaluateUserIntent(userId, message, apiKey)` loads that user's saved
slots, evaluates the new message, and persists the resulting slot values.
`getUserLearningSlots(userId)` retrieves only the requested account's state.
This keeps separate users' goals independent across API calls and process
restarts.

## Terminal Runner

Run `npm run runner`. The CLI connects through `config/db.ts`, validates a
session token stored in `~/.plan-agent-session.json`, and asks the user to log
in or register if the local token is missing or invalid. The token file is
written with owner-only permissions. The runner lists only the signed-in
user's active plans, persists clarification turns for that account, creates a
user-owned plan and DAG, and passes the same user ID to each diagnostic read
and write. Remove the local session file to sign out; server-side token expiry
and secret rotation work the same as for API clients.

The Gemini integration additionally requires `GEMINI_API_KEY`. The CLI should
be run in a trusted local environment; its password prompt uses the terminal's
standard input, so use a private terminal session.