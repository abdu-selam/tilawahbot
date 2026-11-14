import mongoose from "mongoose";

const qariSchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },

    image: String,
  },
  { timestamps: true },
);

export const Qari = mongoose.models.qaris || mongoose.model("qaris", qariSchema);
