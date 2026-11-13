import {
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import QariClass from "../../schemas/qari.schema.js";
import { chooseQari } from "../templates/start.js";

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
  }

  if (total > 10) {
    keyboard.text("Next", "next:1");
  }

  await ctx.reply(chooseQari, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};
