import type { CommandContext, Context } from "grammy";
import { User } from "../../models/models.js";
import type { CtxWithPicture } from "../../types/bot.types.js";

export const checkAdmin = async (
  ctx: CommandContext<Context> | CtxWithPicture,
): Promise<boolean> => {
  const message = ctx.msg;
  const sender = message.from;

  if (!sender || sender?.is_bot) return false;

  const admin = await User.findOne({ uid: sender.id } as any);

  if (!admin) return false;
  if (admin.utype !== "admin") return false;

  return true;
};
