import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { countTelemetryEvents, recordTelemetryEvent } from "../../telemetry/services/telemetry-logger.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([node._id.toString()]);

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): number {
    let count = 0;
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING" || prerequisite.status === "QUEUED") {
        count += 1;
      }
      count += visit(prerequisite.prerequisites);
    }
    return count;
  }

  return visit(node.prerequisites);
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([nodeId]);

  function visit(parentId: string): number {
    let count = 0;
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (child?.status === "PENDING" || child?.status === "QUEUED") {
        count += 1;
      }
      count += visit(childId);
    }
    return count;
  }

  return visit(nodeId);
}

/** Selects the pending node whose known/unknown closure sizes are most balanced. */
export async function getNextDiagnosticNode(
  planId: string,
  userId: string,
): Promise<PlanNodeDocument | null> {
  if (!Types.ObjectId.isValid(planId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid plan and authenticated user ObjectIds are required for diagnostics.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");
  console.log(`[Plan Agent] Verified diagnostic plan ${planId} belongs to user ${userId}.`);

  const pendingNodes = await PlanNode.find({ planId, status: "PENDING" }).sort({
    conceptName: 1,
  });
  const allNodes = await PlanNode.find({ planId });

  if (pendingNodes.length === 0) {
    console.log(`[Plan Agent] Diagnostic complete for plan ${planId}: no pending nodes.`);
    const actualDiagnosticQuestions = await countTelemetryEvents({
      agent: "plan-agent",
      eventType: "diagnostic_question_asked",
      planId,
    });
    const baselineQuestions = allNodes.length;
    await recordTelemetryEvent({
      planId,
      userId,
      agent: "plan-agent",
      eventType: "diagnostic_completed",
      metrics: {
        baselineQuestions,
        actualDiagnosticQuestions,
        diagnosticQuestionReductionPct: baselineQuestions
          ? ((baselineQuestions - actualDiagnosticQuestions) / baselineQuestions) * 100
          : 0,
      },
    });
    return null;
  }

  const nodesById = new Map(
    allNodes.map((node) => [node._id.toString(), node] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const node of allNodes) {
    for (const prerequisiteId of node.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(node._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  let selectedNode: PlanNodeDocument | null = null;
  let lowestScore = Number.POSITIVE_INFINITY;

  for (const node of pendingNodes) {
    const pendingAncestors = collectPendingAncestors(node, nodesById);
    const pendingDescendants = collectPendingDescendants(
      node._id.toString(),
      childrenById,
      nodesById,
    );
    const informationScore = Math.abs(pendingAncestors - pendingDescendants);

    console.log(
      `[Plan Agent] Diagnostic information score: "${node.conceptName}"; pendingAncestors=${pendingAncestors}; pendingDescendants=${pendingDescendants}; score=${informationScore}.`,
    );
    await recordTelemetryEvent({
      planId,
      userId,
      nodeId: node._id.toString(),
      conceptKey: normalizeConceptName(node.conceptName),
      agent: "plan-agent",
      eventType: "diagnostic_node_scored",
      metadata: { pendingAncestors, pendingDescendants, informationScore },
    });

    if (informationScore < lowestScore) {
      lowestScore = informationScore;
      selectedNode = node;
    }
  }

  console.log(
    `[Plan Agent] Selected diagnostic node: "${selectedNode?.conceptName ?? "none"}" (score=${lowestScore}).`,
  );
  if (selectedNode) {
    await recordTelemetryEvent({
      planId,
      userId,
      nodeId: selectedNode._id.toString(),
      conceptKey: normalizeConceptName(selectedNode.conceptName),
      agent: "plan-agent",
      eventType: "diagnostic_node_selected",
      metadata: { informationScore: lowestScore },
    });
  }
  return selectedNode;
}