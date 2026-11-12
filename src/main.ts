import bot from "./bot/bot.js";
import connectDb from "./configs/db.config.js";

const start = async () => {
  await connectDb();
  bot.start();
};

start();
