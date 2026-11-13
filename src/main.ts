import bot from "./bot/bot.js";
import connectDb from "./configs/db.config.js";
import seed, { load } from "./seed.js";

const start = async () => {
  await connectDb();
  await load();
  await seed();
  bot.start();
};

start();
