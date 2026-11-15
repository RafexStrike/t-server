# Micro-Tutor and System 2

## Node-Scoped Micro-Tutor

The Micro-Tutor teaches one selected `PlanNode` at a time. Its prompt names the
node's concept and Bloom level, while the parent plan topic is used only to
disambiguate terminology. Lesson generation returns a compact explanation, a
single check question, and criteria used to evaluate the learner's response.
Remediation prompts include the previous answer and feedback so the tutor can
address the identified misconception without replaying the full lesson.

## System 1 Overload Gatekeeper

Before a lesson is shown, System 1 assesses the combined explanation and check
question against intrinsic and extrinsic working-memory load. If the result is
overloaded, the lesson is regenerated once with the assessment's scaffolding
directives. The revised lesson is assessed again and the resulting WML metrics
are returned to the runner; there is no unbounded regeneration loop.

## System 2 Cognitive Efficiency

After each learner answer, System 2 combines performance on the current
attempt with average assessed WML using normalized Paas cognitive-efficiency
scoring. Successful mastery can raise the future WML capacity threshold when
efficiency is high, or lower it when efficiency indicates significant effort.
The threshold is bounded to `[0.45, 0.90]` and is maintained for the duration
of the interactive learning session.

## Durable UserMastery Contract

On mastery, the node becomes `MASTERED` and the service upserts
`UserMastery` using `{ userId, conceptName }` as its key. The stored score is
the greater of the existing score and the durable score for the attempt count:
`0.95` on the first attempt, `0.90` on the second, and `0.86` thereafter.
Every score remains at or above the prior-plan credit threshold of `0.85`;
later plans can reconcile that evidence case-insensitively against their node
names without reducing an existing mastery score.