import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = Model<UserDocument>;

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const User: UserModel =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<UserDocument, UserModel>("User", UserSchema);

export default User;