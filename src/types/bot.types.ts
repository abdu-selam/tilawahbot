import type { Context, Filter } from "grammy";

export type CtxWithPicture = Filter<Context, "message:photo">;

export type CtxForChnnelMessage = Filter<Context, "channel_post">;
