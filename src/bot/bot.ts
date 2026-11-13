import { Bot } from "grammy";
import env from "../utils/env.js";
import { start as startCommand } from "./commands/user.js";
import {
  addAdmin,
  listAllQari,
  startUpload,
  stopUpload,
} from "./commands/admin.js";

const bot = new Bot(env.token);

bot.command("start", startCommand);

bot.command("add", addAdmin);
bot.command("stopupload", stopUpload);

bot.command("list", listAllQari);

bot.on("message:photo", startUpload);

bot.on("channel_post", async (ctx) => {
  const channel = JSON.stringify(ctx.chat, null, 2);
  await ctx.api.sendMessage(env.admin!, channel);
});

export default bot;
