import { Types } from "mongoose";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { countTransitiveAncestors } from "../utils/outer-fringe-selector.js";
import { evaluateWorkingMemoryLoad } from "../utils/wml-calculator.js";
import type { WmlAssessment } from "../types/wml.js";

export async function assessNodeTurnWml(params: {
  planId: string;
  userId: string;
  nodeId: string;
  textToMeasure: string;
  capacityThreshold?: number;
}): Promise<WmlAssessment> {
  if (!Types.ObjectId.isValid(params.planId)) {
    throw new Error("A valid plan ObjectId is required for WML assessment.");
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    throw new Error("A valid authenticated user ObjectId is required for WML assessment.");
  }
  if (!Types.ObjectId.isValid(params.nodeId)) {
    throw new Error("A valid plan node ObjectId is required for WML assessment.");
  }
  const plan = await Plan.exists({ _id: params.planId, userId: params.userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  const nodes = await PlanNode.find({ planId: params.planId });
  const graphNodes = nodes.map((candidate) => ({
    nodeId: candidate._id.toString(),
    conceptName: candidate.conceptName,
    bloomLevel: candidate.bloomLevel,
    status: candidate.status,
    prerequisiteIds: candidate.prerequisites.map((id) => id.toString()),
  }));
  const node = nodes.find((candidate) => candidate._id.toString() === params.nodeId);
  if (!node) {
    throw new Error("Plan node not found in the authenticated user's plan.");
  }

  const unmasteredConceptNames = nodes
    .filter(
      (candidate) =>
        candidate._id.toString() !== params.nodeId &&
        (candidate.status === "PENDING" || candidate.status === "IN_PROGRESS"),
    )
    .map((candidate) => candidate.conceptName);
  const assessment = evaluateWorkingMemoryLoad({
    bloomLevel: node.bloomLevel,
    directPrerequisiteCount: node.prerequisites.length,
    transitiveAncestorCount: countTransitiveAncestors(params.nodeId, graphNodes),
    text: params.textToMeasure,
    unmasteredConceptNames,
    capacityThreshold: params.capacityThreshold,
  });

  console.log(
    `[Learn Agent][System 1] Concept="${node.conceptName}" | Intrinsic=${assessment.intrinsic.score.toFixed(2)} | Extrinsic=${assessment.extrinsic.score.toFixed(2)} | TotalWML=${assessment.totalWml.toFixed(2)} (${assessment.loadLevel}) | Overloaded=${assessment.isOverloaded}`,
  );
  console.log(
    `[Learn Agent][System 1] Active scaffolding directives: ${assessment.scaffoldingDirectives.join(" | ") || "none"}.`,
  );

  return assessment;
}