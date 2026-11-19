import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { UserMastery } from "../models/UserMastery.js";
import { reopenBacktrackPrerequisite } from "../runner/plan-recovery.js";
import { getOuterFringe } from "../../learn-agent/services/outer-fringe.js";

test(
  "backtrack reopens the highest-Bloom diagnosed prerequisite and queues the current node",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await connectToDatabase();
    const planId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    await Plan.create({
      _id: planId,
      userId,
      topic: "Diagnostic recovery",
      targetDepth: 3,
      status: "READY",
    });
    t.after(async () => {
      await PlanNode.deleteMany({ planId });
      await Plan.deleteOne({ _id: planId });
      await disconnectFromDatabase();
    });

    const foundation = await PlanNode.create({
      planId,
      conceptName: "Foundation",
      bloomLevel: 1,
      status: "PASSED_IN_DIAGNOSTIC",
      prerequisites: [],
    });
    const directPrerequisite = await PlanNode.create({
      planId,
      conceptName: "Direct prerequisite",
      bloomLevel: 2,
      status: "PASSED_IN_DIAGNOSTIC",
      prerequisites: [foundation._id],
    });
    const currentNode = await PlanNode.create({
      planId,
      conceptName: "Current concept",
      bloomLevel: 3,
      status: "IN_PROGRESS",
      prerequisites: [foundation._id, directPrerequisite._id],
    });

    const target = await reopenBacktrackPrerequisite(
      planId.toString(),
      currentNode._id.toString(),
    );

    assert.equal(target?.nodeId, directPrerequisite._id.toString());
    assert.equal((await PlanNode.findById(directPrerequisite._id))?.status, "PENDING");
    assert.equal((await PlanNode.findById(currentNode._id))?.status, "QUEUED");
    assert.equal((await PlanNode.findById(foundation._id))?.status, "PASSED_IN_DIAGNOSTIC");
  },
);

test(
  "backtrack keeps a prior-mastery prerequisite pending and selects it next",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await connectToDatabase();
    const userId = new Types.ObjectId();
    const plan = await Plan.create({
      userId,
      topic: "Prior mastery recovery",
      targetDepth: 3,
      status: "READY",
    });
    t.after(async () => {
      await PlanNode.deleteMany({ planId: plan._id });
      await UserMastery.deleteMany({ userId: userId.toString() });
      await Plan.deleteOne({ _id: plan._id });
      await disconnectFromDatabase();
    });

    const prerequisite = await PlanNode.create({
      planId: plan._id,
      conceptName: "Prior mastery prerequisite",
      bloomLevel: 1,
      status: "MASTERED",
      prerequisites: [],
    });
    const currentNode = await PlanNode.create({
      planId: plan._id,
      conceptName: "Failing dependent",
      bloomLevel: 2,
      status: "IN_PROGRESS",
      prerequisites: [prerequisite._id],
    });
    await UserMastery.create({
      userId: userId.toString(),
      conceptName: prerequisite.conceptName,
      conceptKey: "prior mastery prerequisite",
      canonicalConceptName: prerequisite.conceptName,
      masteryScore: 0.95,
    });

    const target = await reopenBacktrackPrerequisite(
      plan._id.toString(),
      currentNode._id.toString(),
    );
    const fringe = await getOuterFringe(plan._id.toString(), userId.toString());

    assert.equal(target?.nodeId, prerequisite._id.toString());
    assert.equal((await PlanNode.findById(prerequisite._id))?.status, "PENDING");
    assert.equal(fringe.nextNodeId, prerequisite._id.toString());
    assert.equal((await PlanNode.findById(currentNode._id))?.status, "QUEUED");
    assert.equal(
      (await UserMastery.findOne({ userId: userId.toString() }))?.masteryScore,
      0.84,
    );
  },
);