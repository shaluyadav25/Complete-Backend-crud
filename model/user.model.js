import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    photoUrl: {
      type: String,
      required: [true, "photo is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);