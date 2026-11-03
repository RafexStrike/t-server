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

The propagation rules encode the Knowledge Space Theory assumptions used by
this simplified model:

- Passing a concept marks its pending ancestors as
  `PASSED_IN_DIAGNOSTIC`, because prerequisites of a concept the user knows
  are assumed known as well.
- Failing a concept marks its pending descendants as `IN_PROGRESS`, because a
  concept that depends on something the user does not know is assumed unknown
  and should remain in the learning plan.

Both traversals follow the full plan graph, including already resolved
intermediate nodes, but only alter nodes that are currently `PENDING`.