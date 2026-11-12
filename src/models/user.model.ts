import { model, Schema } from "mongoose";

const userSchema = new Schema(
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
  },
  { timestamps: true },
);
