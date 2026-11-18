import mongoose, { Document, Model, Schema } from "mongoose";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";

/**
 * Long-lived evidence of a user's mastery, independent of any one generated
 * plan. User IDs are strings here to support external identity providers.
 */
export interface UserMasteryDocument extends Document {
  userId: string;
  conceptName: string;
  conceptKey: string;
  canonicalConceptName: string;
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
    conceptKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    canonicalConceptName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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

UserMasterySchema.pre("validate", function () {
  if (this.conceptName) {
    this.conceptKey = this.conceptName.trim().toLowerCase();
    this.canonicalConceptName = normalizeConceptName(this.conceptName);
  }
});

// One current mastery estimate per user/concept key pair.
UserMasterySchema.index({ userId: 1, conceptKey: 1 }, { unique: true });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const UserMastery: UserMasteryModel =
  (mongoose.models.UserMastery as UserMasteryModel | undefined) ??
  mongoose.model<UserMasteryDocument, UserMasteryModel>(
    "UserMastery",
    UserMasterySchema,
  );

export default UserMastery;