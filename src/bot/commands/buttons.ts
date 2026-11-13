import {
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import QariClass from "../../schemas/qari.schema.js";
import { chooseQari, chooseSura } from "../templates/start.js";
import SuraClass from "../../schemas/sura.schema.js";

export const selectQaris = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.answerCallbackQuery();

  const { qaris, total } = QariClass.find({});
  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const qari of qaris) {
    keyboard.text(qari.name, `qari:${qari.id}`);
    if (i % 2 === 1) {
      keyboard.row();
    }
    i++;
  }

  if (total > 10) {
    keyboard.text("Next", "next_qari:1");
  }

  await ctx.reply(chooseQari, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const selectSurah = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.answerCallbackQuery();

  const suras = SuraClass.find();

  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const sura of suras) {
    keyboard.text(`${sura.number} (${sura.nameEn})`, `sura:${sura.id}`);
    if (i % 3 === 2) {
      keyboard.row();
    }
    i++;
  }

  keyboard
    .text("Back", "back_sura:-1")
    .text("Full", "full_sura")
    .text("Next", "next_sura:1");

  await ctx.reply(chooseSura, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const nextQaris = async (ctx: CallbackQueryContext<Context>) => {
  const page = Number(ctx.match[1]);

  const { qaris, total } = QariClass.find({ page });
  if (!qaris.length) {
    await ctx.answerCallbackQuery({
      text: "Qaris has been completed",
      show_alert: true,
    });
    return;
  }

  await ctx.answerCallbackQuery();
  if (ctx.chat?.id && ctx.msg?.message_id) {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
  }

  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const qari of qaris) {
    keyboard.text(qari.name, `qari:${qari.id}`);
    if (i % 2 === 1 || qaris.length === i + 1) {
      keyboard.row();
    }
    i++;
  }

  keyboard.text("Back", `back_qari:${page - 1}`);
  if (total > (page + 1) * 10) {
    keyboard.text("Next", `next_qari:${page + 1}`);
  }

  await ctx.reply(chooseQari, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};
