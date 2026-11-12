import { model, Schema } from "mongoose";

const qariSchema = new Schema(
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

const Qari = model("qaris", qariSchema);

export default Qari;
