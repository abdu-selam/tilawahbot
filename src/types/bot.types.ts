import type { Context, Filter } from "grammy";

export type CtxWithPicture = Filter<Context, "message:photo">;
