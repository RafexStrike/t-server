import mongoose, { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { generateAbsoluteMasteryGraph } from "./graph-generator.js";
import { pruneGraph } from "../utils/graph-pruner.js";

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
  const prunedGraph = pruneGraph(rawGraph, targetDepth);
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
    await PlanNode.insertMany(nodesToInsert);
    console.log(
      `[Plan Agent] Inserted ${nodesToInsert.length} PlanNode documents for user ${ownerId.toString()}.`,
    );
  } catch (error) {
    await PlanNode.deleteMany({ planId: plan._id });
    await Plan.deleteOne({ _id: plan._id, userId: ownerId });
    throw error;
  }

  return plan;
}