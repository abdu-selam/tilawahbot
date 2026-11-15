import { InlineKeyboard, type CommandContext, type Context } from "grammy";
import { User } from "../../models/models.js";
import { chooseQari, startHtml } from "../templates/start.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import { startUploadFromExist } from "./admin.js";
import { selectQaris } from "./buttons.js";
import QariClass from "../../schemas/qari.schema.js";
import { generateQariKeyboard } from "../services/button.service.js";

export const start = async (
  ctx: CommandContext<Context>,
  env: Record<string, any>,
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
      utype: env.admin == `${sender.id}` ? "admin" : "user",
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

export const qari = async (ctx: CommandContext<Context>) => {
  const payload = ctx.match;
  if (payload.trim() == "") {
    const { qaris } = QariClass.find({});
    const keyboard = generateQariKeyboard(
      qaris,
      `next_qari:${1}`,
      `back_qari:${-1}`,
    );

    await ctx.reply(chooseQari, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
    return;
  }
};
