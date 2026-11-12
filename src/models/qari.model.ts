import { model, Schema } from "mongoose";

const qariSchema = new Schema(
  {
    nameEn: String,
    nameAr: String,

    image: String,
  },
  { timestamps: true },
);

const Qari = model("qaris", qariSchema);

export default Qari;
