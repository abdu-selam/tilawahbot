import { config } from "dotenv";

config();

const env = {
  token: process.env.BOT_TOKEN || "",
};

export default env;
