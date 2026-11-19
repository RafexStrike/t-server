import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { PlanNode } from "../models/PlanNode.js";
import { reopenBacktrackPrerequisite } from "../runner/plan-recovery.js";

test(
  "backtrack reopens the highest-Bloom diagnosed prerequisite and queues the current node",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await connectToDatabase();
    const planId = new Types.ObjectId();
    t.after(async () => {
      await PlanNode.deleteMany({ planId });
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