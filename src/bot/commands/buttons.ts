import {
  GrammyError,
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import QariClass from "../../schemas/qari.schema.js";
import {
  chooseQari,
  chooseSura,
  choseQariForSura,
  choseSuraForQari,
  recitationCaption,
} from "../templates/start.js";
import SuraClass from "../../schemas/sura.schema.js";
import {
  generateQariKeyboard,
  generateSuraKeyboard,
} from "../services/button.service.js";
import { Recite } from "../../models/models.js";
import { answerCallback } from "../middlewares/button.middleware.js";

export const selectQaris = async (ctx: CallbackQueryContext<Context>) => {
  await answerCallback(ctx);

  const { qaris, total } = QariClass.find({});
  const keyboard = generateQariKeyboard(
    qaris,
    `next_qari:${1}`,
    `back_qari:${-1}`,
    (qari) => `qari:${qari.id}`,
    total,
  );

  const html = chooseQari();
  await ctx.reply(html, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const selectSurah = async (ctx: CallbackQueryContext<Context>) => {
  await answerCallback(ctx);

  const keyboard = generateSuraKeyboard(
    (sura) => `sura:${sura.id}`,
    "next_sura:1",
    "back_sura:-1",
  );

  if (!keyboard) {
    return;
  }

  await ctx.reply(chooseSura, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const nextQaris = async (ctx: CallbackQueryContext<Context>) => {
  const page = Number(ctx.match[1]);

  const { qaris, total } = QariClass.find({ page });
  if (!qaris.length || page < 0) {
    await ctx.answerCallbackQuery({
      text: "Qaris limit has been reached",
      show_alert: true,
    });
    return;
  }

  await answerCallback(ctx);

  const keyboard = generateQariKeyboard(
    qaris,
    `next_qari:${page + 1}`,
    `back_qari:${page - 1}`,
    (qari) => `qari:${qari.id}`,
    total,
    page,
  );

  await ctx.editMessageReplyMarkup({
    reply_markup: keyboard,
  });
};

export const nextSuras = async (ctx: CallbackQueryContext<Context>) => {
  const page = Number(ctx.match[1]);
  const keyboard = generateSuraKeyboard(
    (sura) => `sura:${sura.id}`,
    `next_sura:${page + 1}`,
    `back_sura:${page - 1}`,
    page,
  );

  if (!keyboard) {
    await ctx.answerCallbackQuery({
      text: "Surahs limit has been reached",
      show_alert: true,
    });
    return;
  }

  await answerCallback(ctx);
  try {
    await ctx.editMessageReplyMarkup({
      reply_markup: keyboard,
    });
  } catch (error) {
    if (
      error instanceof GrammyError &&
      error.description.includes("message is not modified")
    ) {
      return;
    }

    throw error;
  }
};

export const selectSurahForQari = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const qariId = ctx.match[1];

  if (!qariId) {
    await answerCallback(ctx);
    return;
  }

  const qari = QariClass.findOne(qariId);
  if (!qari) {
    await answerCallback(ctx);
    return;
  }

  const keyboard = generateSuraKeyboard(
    (sura) => `suraqari:${sura.id}-${qari.id}`,
    `next_suraqari:1-${qari.id}`,
    `back_suraqari:-1-${qari.id}`,
  );

  if (!keyboard) {
    await ctx.answerCallbackQuery({
      text: "Surahs limit has been reached",
      show_alert: true,
    });
    return;
  }

  const html = choseSuraForQari(qari.name, qari.nameAr);

  await answerCallback(ctx);
  await ctx.editMessageMedia(
    {
      type: "photo",
      media: qari.image,
      caption: html,
      parse_mode: "HTML",
    },
    {
      reply_markup: keyboard,
    },
  );
};

export const nextSuraForQari = async (ctx: CallbackQueryContext<Context>) => {
  const text = ctx.match[1];
  let parse = ctx.match[1]?.split("-");
  if (text?.startsWith("-")) {
    const first = text.slice(0, 2);
    const second = text.slice(2);

    parse = [first, second];
  }

  if (!parse?.length || parse.at(0) == "-1") {
    await ctx.answerCallbackQuery({
      text: "Surahs limit has been reached",
      show_alert: true,
    });
    return;
  }

  const page = Number(parse[0]);
  const qari = QariClass.findOne(parse.at(-1)!);
  if (!qari) {
    await answerCallback(ctx);
    return;
  }

  const keyboard = generateSuraKeyboard(
    (sura) => `suraqari:${sura.id}-${qari.id}`,
    `next_suraqari:${page + 1}-${qari.id}`,
    `back_suraqari:${page - 1}-${qari.id}`,
    page,
  );

  if (!keyboard) {
    await ctx.answerCallbackQuery({
      text: "Surahs limit has been reached",
      show_alert: true,
    });
    return;
  }

  await answerCallback(ctx);

  try {
    await ctx.editMessageReplyMarkup({
      reply_markup: keyboard,
    });
  } catch (error) {
    if (
      error instanceof GrammyError &&
      error.description.includes("message is not modified")
    ) {
      return;
    }

    throw error;
  }
};

export const selectQarisForSura = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const suraId = ctx.match[1];

  if (!suraId) {
    await answerCallback(ctx);
    return;
  }
  const sura = SuraClass.findById(suraId);

  if (!sura) {
    await answerCallback(ctx);
    return;
  }

  const { qaris, total } = QariClass.find({});
  const keyboard = generateQariKeyboard(
    qaris,
    `next_qarisura:1-${sura.id}`,
    `back_qarisura:-1-${sura.id}`,
    (qari) => `suraqari:${sura.id}-${qari.id}`,
    total,
  );

  const html = choseQariForSura({ ...sura });

  await ctx.editMessageText(html, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const nextQariForSura = async (ctx: CallbackQueryContext<Context>) => {
  const text = ctx.match[1];
  let parse = ctx.match[1]?.split("-");
  if (text?.startsWith("-")) {
    const first = text.slice(0, 2);
    const second = text.slice(2);

    parse = [first, second];
  }

  if (!parse?.length || parse.at(0) == "-1") {
    await ctx.answerCallbackQuery({
      text: "Qari limit has been reached",
      show_alert: true,
    });
    return;
  }

  const page = Number(parse[0]);
  const sura = SuraClass.findById(parse.at(-1)!);
  if (!sura) {
    await answerCallback(ctx);
    return;
  }

  const { qaris, total } = QariClass.find({ page });
  if (!qaris.length || page < 0) {
    await ctx.answerCallbackQuery({
      text: "Qaris limit has been reached",
      show_alert: true,
    });
    return;
  }

  await answerCallback(ctx);
  if (ctx.chat?.id && ctx.msg?.message_id) {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
  }

  const keyboard = generateQariKeyboard(
    qaris,
    `next_qarisura:${page + 1}-${sura.id}`,
    `back_qarisura:${page - 1}-${sura.id}`,
    (qari) => `suraqari:${sura.id}-${qari.id}`,
    total,
    page,
  );

  const html = choseQariForSura({ ...sura });

  await ctx.editMessageText(html, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const sendQuranAudio = async (ctx: CallbackQueryContext<Context>) => {
  const [, suraId, qariId] = ctx.match;

  if (!suraId || !qariId) {
    await ctx.answerCallbackQuery({
      text: "404: Recite is not found",
      show_alert: true,
    });
    return;
  }

  const recite = await Recite.findOne({
    qari: qariId,
    sura: suraId,
  } as any).lean();

  if (!recite) {
    await ctx.answerCallbackQuery({
      text: "404: Recite is not found",
      show_alert: true,
    });
    return;
  }

  await answerCallback(ctx);

  const qari = QariClass.findOne(qariId)!;
  const surah = SuraClass.findById(suraId)!;

  const html = recitationCaption({
    qari,
    surah,
    recitation: {
      fileSize: recite.fileSize!,
      duration: recite.duration!,
    },
  });

  const keyboard = new InlineKeyboard()
    .text("Qari", "select_qari")
    .text("Sura", "select_sura");

  await ctx.editMessageMedia(
    {
      type: "audio",
      media: recite.audio,
      caption: html,
      parse_mode: "HTML",
    },
    {
      reply_markup: keyboard,
    },
  );
};
