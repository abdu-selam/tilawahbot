import app from "./app.js";
import { createBot } from "./bot/bot.js";
import connectDB from "./configs/db.config.js";
import seed, { load } from "./seed.js";
import env from "./utils/env.js";

const bot = createBot(env.token, env);

const start = async () => {
  await connectDB(env.mongo);
  await load();
  await seed();

  bot.start();
  app.listen(Number(env.port), "0.0.0.0", () => {
    console.log("Server is runnig");
  });
};

start();
