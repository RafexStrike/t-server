import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const PLAN_STATUSES = [
  "DIAGNOSTIC_IN_PROGRESS",
  "READY",
  "COMPLETED",
] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

/**
 * Describes a user's requested learning outcome and the lifecycle of the
 * diagnostic/planning workflow that will produce its curriculum graph.
 */
export interface PlanDocument extends Document {
  userId: Types.ObjectId;
  topic: string;
  targetDepth: number;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanModel = Model<PlanDocument>;

const PlanSchema = new Schema<PlanDocument, PlanModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A plan must belong to a user"],
    },
    topic: {
      type: String,
      required: [true, "A plan topic is required"],
      trim: true,
      minlength: [1, "A plan topic cannot be empty"],
    },
    targetDepth: {
      type: Number,
      required: [true, "A target Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    status: {
      type: String,
      enum: PLAN_STATUSES,
      default: "DIAGNOSTIC_IN_PROGRESS",
      required: true,
    },
  },
  {
    // Lifecycle timestamps make diagnostic and completion events auditable.
    timestamps: true,
    versionKey: false,
  },
);

// Supports a user's active-plan and plan-history queries.
PlanSchema.index({ userId: 1, status: 1, updatedAt: -1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const Plan: PlanModel =
  (mongoose.models.Plan as PlanModel | undefined) ??
  mongoose.model<PlanDocument, PlanModel>("Plan", PlanSchema);

export default Plan;