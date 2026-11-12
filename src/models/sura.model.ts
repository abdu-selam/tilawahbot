import { model, Schema } from "mongoose";

const suraSchema = new Schema(
  {
    nameEn: String,
    nameAr: String,

    number: Number,
    verses: Number,
    revelation: {
      type: String,
      enum: ["Meccan", "Medinan"],
    },
  },
  { timestamps: true },
);

const Sura = model("suras", suraSchema);

export default Sura;
