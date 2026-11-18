import { InlineKeyboard, type CommandContext, type Context } from "grammy";
import { Recite, User } from "../../models/models.js";
import {
  chooseQari,
  chooseSura,
  choseQariForSura,
  helpMessage,
  recitationCaption,
  startHtml,
} from "../templates/start.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import { startUploadFromExist } from "./admin.js";
import QariClass from "../../schemas/qari.schema.js";
import {
  generateQariKeyboard,
  generateSuraKeyboard,
} from "../services/button.service.js";
import type { Env, EnvGeneral } from "../../types/bot.types.js";
import { isSura } from "../../utils/formatter.js";
import SuraClass from "../../schemas/sura.schema.js";

export const start = async (
  ctx: CommandContext<Context>,
  env: EnvGeneral | Env,
) => {
  const isAdmin = await checkAdmin(ctx);

  if (isAdmin) {
    const payload = ctx.match;
    if (payload.startsWith("upload_")) {
      await startUploadFromExist(ctx);
    } else {
      await ctx.reply("Everthing up to date");
    }

    return;
  }

  const message = ctx.msg;
  const sender = message.from;

  if (!sender || sender?.is_bot) return;

  const user = await User.findOne({ uid: sender.id } as any);

  if (!user) {
    const user = new User({
      uid: sender.id,
      utype: env.admin == sender.id ? "admin" : "user",
      username: sender.username,
    });

    await user.save();
  }

  const keyboard = new InlineKeyboard()
    .text("Qari", "select_qari")
    .text("Sura", "select_sura");

  await ctx.reply(startHtml, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const help = async (ctx: CommandContext<Context>) => {
  const keyboard = new InlineKeyboard()
    .text("Qari", "select_qari")
    .text("Sura", "select_sura");

  await ctx.reply(helpMessage, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const qari = async (ctx: CommandContext<Context>) => {
  const payload = ctx.match;
  if (payload.trim() == "") {
    const { qaris, total } = QariClass.find({});
    const keyboard = generateQariKeyboard(
      qaris,
      `next_qari:${1}`,
      `back_qari:${-1}`,
      (qari) => `qari:${qari.id}`,
      total,
    );

    const html = chooseQari()
    await ctx.reply(html, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
    return;
  }
};

export const sura = async (ctx: CommandContext<Context>) => {
  const payload = ctx.match;
  if (payload.trim() == "") {
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
    return;
  }

  if (isSura(payload.trim())) {
    const suraNum = Number(payload.trim());

    const sura = SuraClass.findOne(suraNum)!;

    const { qaris, total } = QariClass.find({});
    const keyboard = generateQariKeyboard(
      qaris,
      `next_qarisura:1-${sura.id}`,
      `back_qarisura:-1-${sura.id}`,
      (qari) => `suraqari:${sura.id}-${qari.id}`,
      total,
    );

    const html = choseQariForSura({ ...sura });

    await ctx.reply(html, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
};

export const randomQirat = async (ctx: CommandContext<Context>) => {
  const qari = QariClass.findRandom();
  const sura = SuraClass.findRandom();

  if (!qari) {
    await ctx.reply("404: Recite is not found");
    return;
  }

  const recite = await Recite.findOne({
    qari: qari.id,
    sura: sura.id,
  } as any).lean();

  if (!recite) {
    await ctx.reply("404: Recite is not found");
    return;
  }

  const html = recitationCaption({
    qari,
    surah: sura,
    recitation: {
      fileSize: recite.fileSize!,
      duration: recite.duration!,
    },
  });

  const keyboard = new InlineKeyboard()
    .text("Qari", "select_qari")
    .text("Sura", "select_sura");
    
  await ctx.replyWithAudio(recite.audio, {
    caption: html,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};
