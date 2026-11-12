import { InlineKeyboard, type CommandContext, type Context } from "grammy";
import User from "../../models/user.model.js";
import env from "../../utils/env.js";
import { startHtml } from "../templates/start.js";

export const start = async (ctx: CommandContext<Context>) => {
  const message = ctx.msg;
  const sender = message.from;

  if (!sender || sender?.is_bot) return;

  const user = await User.findOne({ uid: sender.id });

  if (!user) {
    const user = new User({
      uid: sender.id,
      utype: env.admin == `${sender.id}` ? "admin" : "user",
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
