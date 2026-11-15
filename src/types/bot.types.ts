import type { Context, Filter } from "grammy";

export type CtxWithPicture = Filter<Context, "message:photo">;

export type CtxForChnnelMessage = Filter<Context, "channel_post">;

export interface EnvGeneral {
  token: string;
  mongo: string;
  admin: number;

  pictures: number;
  qurans: number;

  bot: string;
  port: string | number;
}

export interface Env {
  token: string;
  mongo: string;
  WEBHOOK_SECRET: string;
  admin: number;

  pictures: number;
  qurans: number;

  bot: string;

  MONGODB: DurableObjectNamespace;
}
