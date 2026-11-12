import { Bot } from "grammy";
import env from "../utils/env.js";
import { start as startCommand } from "./commands/user.js";
import { addAdmin } from "./commands/admin.js";

const bot = new Bot(env.token);

bot.command("start", startCommand);
bot.command("add", addAdmin)

export default bot;
