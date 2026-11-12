import { model, Schema } from "mongoose";

const suraSchema = new Schema(
  {
    nameEn: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },

    number: {
      type: Number,
      required: true,
    },
    verses: {
      type: Number,
      required: true,
    },
    revelation: {
      type: String,
      enum: ["Meccan", "Medinan"],
      required: true,
    },
  },
  { timestamps: true },
);

const Sura = model("suras", suraSchema);

export default Sura;
