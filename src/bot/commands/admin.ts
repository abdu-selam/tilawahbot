import { type CommandContext, type Context } from "grammy";
import User from "../../models/user.model.js";
import QariClass from "../../schemas/qari.schema.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import { formatMessage } from "../../utils/formatter.js";
import type { CtxWithPicture } from "../../types/bot.types.js";
import env from "../../utils/env.js";

export const addAdmin = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  const text = ctx.match.trim();

  const user = await User.findOne({ username: text });
  if (!user) {
    await ctx.reply("User not found");
    return;
  }

  user.utype = "admin";

  await user.save();

  await ctx.reply(
    `User <a href="tg://user?id=${user.uid}">${user.username}</a> has been made an Admin`,
    {
      parse_mode: "HTML",
    },
  );
};

export const stopUpload = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  if (!QariClass.status) {
    await ctx.reply(`There is no started upload`);
    return;
  }

  const stoped = QariClass.stopAdd();

  await ctx.reply(`Uploading of Qari: ${stoped?.name} has been stopped`);
};

export const startUpload = async (ctx: CtxWithPicture) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  const message = ctx.msg;
  if (!message.caption) {
    await ctx.reply("Please give valid message");
    return;
  }

  const formmated = formatMessage(message.caption);
  if (!formmated) {
    await ctx.reply("Please give valid message");
    return;
  }

  if (!message.photo) {
    await ctx.reply("Please provide Qari image");
    return;
  }

  let image = message.photo.at(-1)!.file_id;

  if (!image) {
    await ctx.reply("Please provide Qari image");
    return;
  }

  const upload = await ctx.api.sendPhoto(env.pictures, image);
  image = upload.photo.at(-1)!.file_id;

  const qari = await QariClass.add(formmated.nameEn, formmated.nameAr, image);

  QariClass.startAdd(qari.id);
  await ctx.reply(`Qari ${qari.name} upload has been started`);
};
