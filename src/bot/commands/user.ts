import { InlineKeyboard, type CommandContext, type Context } from "grammy";
import { Message, Recite, User } from "../../models/models.js";
import {
  chooseQari,
  chooseSura,
  choseQariForSura,
  helpMessage,
  recitationCaption,
  replyForCleanMessege,
  startHtml,
  tellAdminIncommingMessage,
} from "../templates/start.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import { startUploadFromExist } from "./admin.js";
import QariClass from "../../schemas/qari.schema.js";
import {
  generateQariKeyboard,
  generateSuraKeyboard,
} from "../services/button.service.js";
import type { Env, EnvGeneral } from "../../types/bot.types.js";
import { isEmoji, isSura } from "../../utils/formatter.js";
import SuraClass from "../../schemas/sura.schema.js";
import env from "../../utils/env.js";
import mongoose from "mongoose";

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

    const html = chooseQari();
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

export const sendMessage = async (ctx: CommandContext<Context>) => {
  const payload = ctx.match;
  const msg = ctx.msg;
  const sender = msg.from;

  const chatType = ctx.chat.type;

  if (chatType !== "private") {
    return;
  }

  if (!sender || sender?.is_bot) {
    return;
  }

  if (!payload.trim()) {
    const message = replyForCleanMessege(ctx.from?.first_name);
    await ctx.reply(message, {
      parse_mode: "HTML",
    });
    return;
  }

  const message = new Message({
    uid: sender.id,
    message: payload.trim(),
    messageId: msg.message_id,
    chatId: ctx.chat.id,
  });

  await message.save();

  const adminMsg = tellAdminIncommingMessage(
    sender.id,
    payload.trim(),
    message.id,
  );
  await ctx.api.sendMessage(env.admin, adminMsg, {
    parse_mode: "HTML",
  });

  await ctx.reply("Your message has been delivered!");
};

export const reactOnMessage = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  const messageId = ctx.match.trim();

  if (!messageId) {
    await ctx.reply("Please provide valid format");
    return;
  }

  if (!mongoose.isValidObjectId(messageId)) {
    await ctx.reply("Please provide valid message id");
    return;
  }

  const message = await Message.findOne({ _id: messageId } as any);

  if (!message) {
    await ctx.reply("Please provide valid message id");
    return;
  }

  message.read = true;

  await message.save();
  await ctx.api.setMessageReaction(message.chatId, message.messageId, [
    { type: "emoji", emoji: "🙏" },
  ]);

  await ctx.react("🔥");
};
