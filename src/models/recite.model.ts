import mongoose  from "mongoose";

const reciteSchema = new mongoose.Schema(
  {
    qari: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "qaris",
    },
    sura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "suras",
    },

    messageId: String,
    audio: String,
    fileSize: Number,
    duration: Number,
  },
  { timestamps: true },
);

export const Recite = mongoose.models.recites || mongoose.model("recites", reciteSchema);
