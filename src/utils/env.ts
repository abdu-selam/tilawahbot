import { config } from "dotenv";

config();

const env = {
  token: process.env.BOT_TOKEN || "",
  mongo: process.env.MONGODB_URI || "",
  admin: process.env.ADMIN,

  pictures: process.env.PICTURE_CHANNEL_ID || "",
  qurans: process.env.QURAN_CHANNEL_ID || "",
};

export default env;
