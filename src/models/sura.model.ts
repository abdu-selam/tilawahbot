import mongoose from "mongoose";

const suraSchema = new mongoose.Schema(
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

export const Sura =
  mongoose.models.suras || mongoose.model("suras", suraSchema);
