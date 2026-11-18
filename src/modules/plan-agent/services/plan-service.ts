import mongoose, { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { recordTelemetryEvent } from "../../telemetry/services/telemetry-logger.js";
import { generateAbsoluteMasteryGraph } from "./graph-generator.js";
import { breakPrerequisiteCycles, pruneGraphWithStats } from "../utils/graph-pruner.js";

/**
 * Generates and stores a user's requested learning plan and its prerequisite
 * nodes. Graph generation remains separate from persistence and pruning.
 */
export async function createLearningPlan(
  userId: string | Types.ObjectId,
  topic: string,
  targetDepth: number,
  apiKey: string,
) {
  const startedAt = Date.now();
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to create a learning plan.");
  }
  const ownerId = new Types.ObjectId(userId);
  const owner = await User.exists({ _id: ownerId });
  if (!owner) {
    throw new Error(`Cannot create a learning plan: user ${ownerId.toString()} does not exist.`);
  }
  console.log(`[Plan Agent] Verified plan owner ${ownerId.toString()}.`);

  console.log(`[Plan Agent] Fetching absolute mastery graph for "${topic}".`);
  const rawGraph = await generateAbsoluteMasteryGraph(topic, apiKey);

  console.log(`[Plan Agent] Pruning graph to Bloom level ${targetDepth}.`);
  const { nodes: prunedGraph, stats: pruningStats } = pruneGraphWithStats(
    rawGraph,
    targetDepth,
  );
  if (prunedGraph.length === 0) {
    throw new Error(
      `Cannot create learning plan for "${topic}": graph pruning produced 0 valid nodes at targetDepth ${targetDepth}.`,
    );
  }
  console.log(
    `[Plan Agent] Graph pruning complete: ${rawGraph.length} raw nodes, ${prunedGraph.length} retained nodes, ${rawGraph.length - prunedGraph.length} pruned.`,
  );

  const plan = new Plan({
    userId: ownerId,
    topic,
    targetDepth,
    status: "DIAGNOSTIC_IN_PROGRESS",
  });
  const nodeIdsByName = new Map<string, Types.ObjectId>(
    prunedGraph.map((node) => [node.conceptName, new mongoose.Types.ObjectId()]),
  );

  const nodesToInsert = prunedGraph.map((node) => {
    const prerequisites = node.prerequisiteNames.map((prerequisiteName) => {
      const prerequisiteId = nodeIdsByName.get(prerequisiteName);
      if (!prerequisiteId) {
        throw new Error(
          `Prerequisite "${prerequisiteName}" for "${node.conceptName}" was not present in the pruned graph.`,
        );
      }
      return prerequisiteId;
    });

    return {
      _id: nodeIdsByName.get(node.conceptName),
      planId: plan._id,
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: "PENDING" as const,
      prerequisites,
    };
  });

  await plan.save();
  console.log(`[Plan Agent] Plan ${plan._id.toString()} persisted for user ${ownerId.toString()}.`);
  try {
    const acyclicGraph = breakPrerequisiteCycles(prunedGraph);
    const acyclicPrerequisitesById = new Map(
      acyclicGraph.map((node) => [
        nodeIdsByName.get(node.conceptName)!.toString(),
        node.prerequisiteNames.map((name) => {
          const prerequisiteId = nodeIdsByName.get(name);
          if (!prerequisiteId) throw new Error(`Prerequisite "${name}" was not present in the pruned graph.`);
          return prerequisiteId;
        }),
      ]),
    );
    for (const node of nodesToInsert) {
      const prerequisites = acyclicPrerequisitesById.get((node._id as Types.ObjectId).toString());
      if (!prerequisites) throw new Error("A persisted node could not be matched to its graph concept.");
      node.prerequisites = prerequisites;
    }
    await PlanNode.insertMany(nodesToInsert);
    console.log(
      `[Plan Agent] Inserted ${nodesToInsert.length} PlanNode documents for user ${ownerId.toString()}.`,
    );
    await recordTelemetryEvent({
      userId: ownerId,
      planId: plan._id,
      conceptKey: normalizeConceptName(topic),
      agent: "plan-agent",
      eventType: "plan_generated",
      metrics: {
        ...pruningStats,
        durationMs: Date.now() - startedAt,
      },
      metadata: { topic, targetDepth },
    });
  } catch (error) {
    await PlanNode.deleteMany({ planId: plan._id });
    await Plan.deleteOne({ _id: plan._id, userId: ownerId });
    throw error;
  }

  return plan;
}