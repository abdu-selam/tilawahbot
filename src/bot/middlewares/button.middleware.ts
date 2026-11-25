import { GrammyError, type CallbackQueryContext, type Context } from "grammy";

export const answerCallback = async (ctx: CallbackQueryContext<Context>) => {
  try {
    await ctx.answerCallbackQuery();
  } catch (error) {}
};

export const editReplyMessageMiddleware = async (
  callback: () => Promise<unknown>,
) => {
  try {
    await callback();
  } catch (error) {
    if (
      error instanceof GrammyError &&
      error.description.includes("message is not modified")
    ) {
      return;
    }

    throw error;
  }
};
