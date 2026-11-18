# Adaptive Diagnostic Algorithm

The diagnostic engine selects a pending concept by counting its pending
transitive prerequisites and pending transitive dependents. It minimizes
`abs(pendingAncestors - pendingDescendants)`, choosing a node with a balanced
number of unresolved concepts on either side. Each candidate's counts and
score are logged to make selection debuggable.

This is a count-based approximation of Shannon entropy reduction: if the
possible known/unknown outcomes are treated as similarly likely, a question
that divides the unresolved prerequisite graph into balanced groups is
expected to reduce uncertainty more than one near either end. It is a
heuristic, not an exact entropy calculation; DAG branching and overlapping
closures can make the groups' actual probabilities unequal.

For each selected node, the runner requests one diagnostic question calibrated
to the node's Bloom level and the plan topic. Gemini grades the learner's
free-text response against explicit passing criteria; skips and non-mastery
produce a `false` result. This binary pass/fail observation is passed to the
KST propagation engine, which updates the node and its related concepts.

The propagation rules encode the Knowledge Space Theory assumptions used by
this simplified model:

- Passing a concept marks PENDING and QUEUED ancestors as `PASSED_IN_DIAGNOSTIC`.
- Failing a concept marks PENDING and QUEUED descendants as `QUEUED`, because they require learning rather than active Tutor start.
- Reaching the diagnostic question budget queues remaining PENDING nodes as `QUEUED`.