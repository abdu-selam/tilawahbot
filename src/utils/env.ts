import { config } from "dotenv";
import type { EnvGeneral } from "../types/bot.types.js";

config();

const env: EnvGeneral & { port: string | number } = {
  token: process.env.BOT_TOKEN || "",
  mongo: process.env.MONGODB_URI || "",
  admin: Number(process.env.ADMIN) || 0,

  pictures: Number(process.env.PICTURE_CHANNEL_ID) || 0,
  qurans: Number(process.env.QURAN_CHANNEL_ID) || 0,

  bot: process.env.BOT_LINK || "",
  port: Number(process.env.PORT) || 5000,
};

export default env;
