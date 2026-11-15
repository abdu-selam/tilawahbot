import app from "./app.js";
import { createBot } from "./bot/bot.js";
import connectDB from "./configs/db.config.js";
import seed, { load } from "./seed.js";
import env from "./utils/env.js";

const bot = createBot(env.token, env);

const start = async () => {
  await connectDB(env.mongo);
  await seed();
  await load();

  bot.start();
  app.listen(env.port, () => {
    console.log("Server is runnig");
  });
};

start();
