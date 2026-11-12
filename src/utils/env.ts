import { config } from "dotenv";

config();

const env = {
  token: process.env.BOT_TOKEN || "",
  mongo: process.env.MONGODB_URI || "",
};

export default env;
