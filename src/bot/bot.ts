import { Bot } from "grammy";
import {
  help,
  qari,
  randomQirat,
  reactOnMessage,
  replyForUserMessage,
  sendMessage,
  start as startCommand,
  sura,
} from "./commands/user.js";
import {
  addAdmin,
  announce,
  announceMessage,
  clearAnnounce,
  currentUpload,
  listAllQari,
  postAnnouncement,
  showAnnounce,
  startUpload,
  stopUpload,
  totalUsers,
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
import { errorHtml } from "./templates/start.js";
import { escapeHtml, parseError } from "../utils/formatter.js";

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
  bot.command("random", randomQirat);

  bot.command("help", help);

  bot.command("anounce", announce);
  bot.command("showanounce", showAnnounce);
  bot.command("clearanounce", clearAnnounce);
  bot.command("post", postAnnouncement);

  bot.command("users", totalUsers);
  bot.command("message", sendMessage);

  bot.command("read", reactOnMessage);
  bot.command("reply", replyForUserMessage);

  bot.on("message:photo", (ctx) => {
    startUpload(ctx, env);
  });

  bot.on("message", announceMessage);

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
    try {
      const ctx = err.ctx;

      const parsed = parseError(err);

      const html = errorHtml(parsed, ctx.from?.id);
      ctx.api.sendMessage(env.admin, html, {
        parse_mode: "HTML",
      });
    } catch (error) {
      console.log("============================");
      console.log(error);
      console.log("############################");
    }
  });

  return bot;
}
