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

    replied: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },

    reply: {
      type: Boolean,
      default: false,
    },

    messageId: {
      type: String,
      required: true,
    },

    chatId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);
