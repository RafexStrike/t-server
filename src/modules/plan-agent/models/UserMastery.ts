import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Long-lived evidence of a user's mastery, independent of any one generated
 * plan. User IDs are strings here to support external identity providers.
 */
export interface UserMasteryDocument extends Document {
  userId: string;
  conceptName: string;
  masteryScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserMasteryModel = Model<UserMasteryDocument>;

const UserMasterySchema = new Schema<UserMasteryDocument, UserMasteryModel>(
  {
    userId: {
      type: String,
      required: [true, "Mastery evidence must belong to a user"],
      trim: true,
      minlength: [1, "userId cannot be empty"],
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    masteryScore: {
      type: Number,
      required: true,
      min: [0, "Mastery score must be at least 0"],
      max: [1, "Mastery score cannot exceed 1"],
    },
  },
  {
    // Updated timestamps let later plans use the latest mastery evidence.
    timestamps: true,
    versionKey: false,
  },
);

// One current mastery estimate per user/concept pair; upserts can target this key.
UserMasterySchema.index({ userId: 1, conceptName: 1 }, { unique: true });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const UserMastery: UserMasteryModel =
  (mongoose.models.UserMastery as UserMasteryModel | undefined) ??
  mongoose.model<UserMasteryDocument, UserMasteryModel>(
    "UserMastery",
    UserMasterySchema,
  );

export default UserMastery;