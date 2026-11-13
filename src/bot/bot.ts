import { Bot } from "grammy";
import env from "../utils/env.js";
import { start as startCommand } from "./commands/user.js";
import {
  addAdmin,
  currentUpload,
  listAllQari,
  startUpload,
  stopUpload,
} from "./commands/admin.js";
import { uploadQurans } from "./commands/channel.js";
import {
  nextQaris,
  nextSuraForQari,
  nextSuras,
  selectQaris,
  selectSurah,
  selectSurahForQari,
} from "./commands/buttons.js";

const bot = new Bot(env.token);

bot.command("start", startCommand);

bot.command("add", addAdmin);
bot.command("stopupload", stopUpload);

bot.command("list", listAllQari);
bot.command("current", currentUpload);

bot.on("message:photo", startUpload);

bot.on("channel_post", async (ctx) => {
  const channel = ctx.chat;

  if (channel.id == Number(env.qurans)) {
    await uploadQurans(ctx);
    return;
  }
});

bot.callbackQuery("select_qari", selectQaris);
bot.callbackQuery(/^next_qari:(\d+)$/, nextQaris);
bot.callbackQuery(/^back_qari:(-?\d+)$/, nextQaris);

bot.callbackQuery(/^qari:([a-zA-Z0-9]+)$/, selectSurahForQari);
bot.callbackQuery(/^next_suraqari:(\d+-[a-zA-Z0-9]+)$/, nextSuraForQari);

bot.callbackQuery("select_sura", selectSurah);
bot.callbackQuery(/^next_sura:(\d+)$/, nextSuras);
bot.callbackQuery(/^back_sura:(-?\d+)$/, nextSuras);


bot.catch((err) => {
  console.log(err.message)
});

export default bot;
