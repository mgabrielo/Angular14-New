import { Schema, model } from "mongoose";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  address: string;
  isAdmin: boolean;
}

export const UserSchema = new Schema<User>(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    isAdmin: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const UserModel = model<User>("user", UserSchema);
