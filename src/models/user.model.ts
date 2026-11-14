import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      required: true,
      unique: true,
    },

    utype: {
      type: String,
      enum: ["user", "admin"],
    },

    username: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
