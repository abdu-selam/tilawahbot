import { Bot } from "grammy";
import env from "../utils/env.js";
import { start as startCommand } from "./commands/user.js";

const bot = new Bot(env.token);

bot.command("start", startCommand);

export default bot;
