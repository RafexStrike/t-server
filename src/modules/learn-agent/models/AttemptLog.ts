import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { WmlAssessment } from "../types/wml.js";

export interface AttemptLogDocument extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  nodeId: string;
  conceptKey: string;
  attemptNumber: number;
  questionPrompt?: string;
  taskContext?: string;
  userAnswer: string;
  isCorrect: boolean;
  wmlScore: WmlAssessment;
  tutorFeedback: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AttemptLogModel = Model<AttemptLogDocument>;

const AttemptLogSchema = new Schema<AttemptLogDocument, AttemptLogModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    nodeId: { type: String, required: true, trim: true },
    conceptKey: { type: String, required: true, trim: true, lowercase: true },
    attemptNumber: { type: Number, required: true, min: 1 },
    questionPrompt: { type: String },
    taskContext: { type: String },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    wmlScore: {
      intrinsic: {
        bloomFactor: { type: Number, required: true },
        directPrereqFactor: { type: Number, required: true },
        transitiveDepthFactor: { type: Number, required: true },
        score: { type: Number, required: true },
      },
      extrinsic: {
        sentenceLengthFactor: { type: Number, required: true },
        lexicalDensityFactor: { type: Number, required: true },
        codeDensityFactor: { type: Number, required: true },
        novelTermFactor: { type: Number, required: true },
        score: { type: Number, required: true },
      },
      totalWml: { type: Number, required: true },
      capacityThreshold: { type: Number, required: true },
      loadLevel: {
        type: String,
        enum: ["LOW", "OPTIMAL", "HIGH", "OVERLOADED"],
        required: true,
      },
      isOverloaded: { type: Boolean, required: true },
      scaffoldingDirectives: { type: [String], required: true },
    },
    tutorFeedback: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

AttemptLogSchema.index({ userId: 1, planId: 1, nodeId: 1, createdAt: 1 });
AttemptLogSchema.index({ userId: 1, conceptKey: 1, createdAt: -1 });
AttemptLogSchema.index(
  { userId: 1, planId: 1, nodeId: 1, attemptNumber: 1 },
  { unique: true },
);

export const AttemptLog: AttemptLogModel =
  (mongoose.models.AttemptLog as AttemptLogModel | undefined) ??
  mongoose.model<AttemptLogDocument, AttemptLogModel>("AttemptLog", AttemptLogSchema);

export default AttemptLog;