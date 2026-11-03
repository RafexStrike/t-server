import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const PLAN_NODE_STATUSES = [
  "PASSED_IN_DIAGNOSTIC",
  "PENDING",
  "IN_PROGRESS",
  "MASTERED",
] as const;

export type PlanNodeStatus = (typeof PLAN_NODE_STATUSES)[number];

/**
 * One concept in a plan's prerequisite DAG. Each node stores references to
 * its immediate prerequisite nodes; this is the parent-reference edge model
 * used by MongoDB graph traversals.
 */
export interface PlanNodeDocument extends Document {
  planId: Types.ObjectId;
  conceptName: string;
  bloomLevel: number;
  status: PlanNodeStatus;
  prerequisites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type PlanNodeModel = Model<PlanNodeDocument>;

const PlanNodeSchema = new Schema<PlanNodeDocument, PlanNodeModel>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "A plan node must belong to a plan"],
      index: true,
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    bloomLevel: {
      type: Number,
      required: [true, "A Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    status: {
      type: String,
      enum: PLAN_NODE_STATUSES,
      default: "PENDING",
      required: true,
    },
    prerequisites: {
      // A concept can have zero or more immediate prerequisites. Keeping
      // references here supports $graphLookup from a node to its ancestors.
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "PlanNode",
        },
      ],
      default: [],
      validate: {
        validator: (references: Types.ObjectId[]): boolean =>
          references.every((reference) => reference instanceof Types.ObjectId),
        message: "Every prerequisite must be a PlanNode ObjectId",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// These indexes constrain common plan reads and prerequisite-edge lookups.
PlanNodeSchema.index({ planId: 1, bloomLevel: 1 });
PlanNodeSchema.index({ prerequisites: 1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const PlanNode: PlanNodeModel =
  (mongoose.models.PlanNode as PlanNodeModel | undefined) ??
  mongoose.model<PlanNodeDocument, PlanNodeModel>("PlanNode", PlanNodeSchema);

export default PlanNode;