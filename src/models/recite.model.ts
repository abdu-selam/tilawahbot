import { model, Schema } from "mongoose";

const reciteSchema = new Schema(
  {
    qari: {
      type: Schema.Types.ObjectId,
      ref: "qaris",
    },
    sura: {
      type: Schema.Types.ObjectId,
      ref: "suras",
    },

    messageId: String,
    audio: String,
    fileSize: Number,
    duration: Number,
  },
  { timestamps: true },
);

const Recite = model("recites", reciteSchema);

export default Recite;
