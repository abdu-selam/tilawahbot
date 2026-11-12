import { Bot } from "grammy";
import env from "./utils/env.js";

const bot = new Bot(env.token)

bot.start()
