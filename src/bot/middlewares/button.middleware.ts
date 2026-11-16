import type { CallbackQueryContext, Context } from "grammy";

export const answerCallback = async (ctx: CallbackQueryContext<Context>) => {
  try {
    await ctx.answerCallbackQuery();
  } catch (error) {}
};
