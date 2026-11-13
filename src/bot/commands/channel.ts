import { type CommandContext, type Context } from "grammy";
import QariClass from "../../schemas/qari.schema.js";
import Recite from "../../models/recite.model.js";
import SuraClass from "../../schemas/sura.schema.js";
import type { CtxForChnnelMessage } from "../../types/bot.types.js";

export const uploadQurans = async (ctx: CtxForChnnelMessage) => {
  const message = ctx.msg;
  const audio = message.audio;

  if (!QariClass.status || !audio) {
    await ctx.api.deleteMessage(message.chat.id, message.message_id);
    return;
  }

  const sura = SuraClass.findOne(QariClass.current);
  if (!sura) {
    await ctx.api.deleteMessage(message.chat.id, message.message_id);
    return;
  }

  QariClass.current++;
  const recite = new Recite({
    qari: QariClass.qari?.id,
    sura: sura.id,

    messageId: message.message_id,
    audio: audio.file_id,
    fileSize: audio.file_size,
    duration: audio.duration,
  });

  await recite.save();
  await ctx.react("👌");
};
