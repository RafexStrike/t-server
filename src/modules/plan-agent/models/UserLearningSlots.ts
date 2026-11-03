import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { LearningSlots } from "../types/slots.js";

export interface UserLearningSlotsDocument extends Document {
  userId: Types.ObjectId;
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLearningSlotsModel = Model<UserLearningSlotsDocument>;

const UserLearningSlotsSchema = new Schema<UserLearningSlotsDocument, UserLearningSlotsModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetLanguageOrTool: { type: String, default: null, trim: true },
    specificSubdomain: { type: String, default: null, trim: true },
    targetDepth: { type: Number, default: null, min: 1, max: 6 },
  },
  { timestamps: true, versionKey: false },
);

export const UserLearningSlots: UserLearningSlotsModel =
  (mongoose.models.UserLearningSlots as UserLearningSlotsModel | undefined) ??
  mongoose.model<UserLearningSlotsDocument, UserLearningSlotsModel>(
    "UserLearningSlots",
    UserLearningSlotsSchema,
  );

export function toLearningSlots(record: UserLearningSlotsDocument): LearningSlots {
  return {
    targetLanguageOrTool: record.targetLanguageOrTool,
    specificSubdomain: record.specificSubdomain,
    targetDepth: record.targetDepth,
  };
}

export default UserLearningSlots;