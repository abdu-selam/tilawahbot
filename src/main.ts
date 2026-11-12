import bot from "./bot/bot.js";
import connectDb from "./configs/db.config.js";
import seed from "./seed.js";

const start = async () => {
  await connectDb();
  await seed();
  bot.start();
};

start();
