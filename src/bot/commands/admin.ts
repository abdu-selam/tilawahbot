import { type CommandContext, type Context } from "grammy";
import User from "../../models/user.model.js";

export const addAdmin = async (ctx: CommandContext<Context>) => {
  const message = ctx.msg;
  const sender = message.from;

  if (!sender || sender?.is_bot) return;

  const admin = await User.findOne({ uid: sender.id });

  if (!admin) return;
  if (admin.utype !== "admin") return;

  const text = ctx.match.trim();

  const user = await User.findOne({ username: text });
  if (!user) {
    await ctx.reply("User not found");
    return;
  }

  user.utype = "admin";

  await user.save();

  await ctx.reply(
    `User <a href="tg://user?id=${user.uid}">${user.username}</a> added`,
    {
      parse_mode: "HTML",
    },
  );
};
