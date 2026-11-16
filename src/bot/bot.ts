import { Bot } from "grammy";
import { qari, start as startCommand, sura } from "./commands/user.js";
import {
  addAdmin,
  currentUpload,
  listAllQari,
  startUpload,
  stopUpload,
} from "./commands/admin.js";
import { uploadQurans } from "./commands/channel.js";
import {
  nextQariForSura,
  nextQaris,
  nextSuraForQari,
  nextSuras,
  selectQaris,
  selectQarisForSura,
  selectSurah,
  selectSurahForQari,
  sendQuranAudio,
} from "./commands/buttons.js";
import type { Env, EnvGeneral } from "../types/bot.types.js";

export function createBot(token: string, env: EnvGeneral | Env) {
  const bot = new Bot(token);

  bot.command("start", (ctx) => {
    startCommand(ctx, env);
  });

  bot.command("add", addAdmin);
  bot.command("stopupload", stopUpload);

  bot.command("list", (ctx) => {
    listAllQari(ctx, env);
  });
  bot.command("current", currentUpload);

  bot.command("qari", qari);
  bot.command("sura", sura);

  bot.on("message:photo", (ctx) => {
    startUpload(ctx, env);
  });

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
  bot.callbackQuery(/^back_suraqari:(-?\d+-[a-zA-Z0-9]+)$/, nextSuraForQari);

  bot.callbackQuery("select_sura", selectSurah);
  bot.callbackQuery(/^next_sura:(\d+)$/, nextSuras);
  bot.callbackQuery(/^back_sura:(-?\d+)$/, nextSuras);

  bot.callbackQuery(/^sura:([a-zA-Z0-9]+)$/, selectQarisForSura);
  bot.callbackQuery(/^next_qarisura:(\d+-[a-zA-Z0-9]+)$/, nextQariForSura);
  bot.callbackQuery(/^back_qarisura:(-?\d+-[a-zA-Z0-9]+)$/, nextQariForSura);

  bot.callbackQuery(/suraqari:([a-zA-Z0-9]+)-([a-zA-Z0-9]+)$/, sendQuranAudio);
  bot.callbackQuery("page_count", async (ctx) => {
    await ctx.answerCallbackQuery();
  });

  bot.catch((err) => {
    console.log(err.message);
  });

  return bot;
}
