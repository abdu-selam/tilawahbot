import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
    reply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);
