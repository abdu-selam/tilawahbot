import type { Context, Filter } from "grammy";

export type CtxWithPicture = Filter<Context, "message:photo">;

export type CtxForChnnelMessage = Filter<Context, "channel_post">;

export type CtxForMessage = Filter<Context, "message">;

export interface EnvGeneral {
  token: string;
  mongo: string;
  admin: number;

  pictures: number;
  qurans: number;

  bot: string;
  port: number;
}

export interface Env {
  token: string;
  mongo: string;
  admin: number;
  
  pictures: number;
  qurans: number;
  
  bot: string;
  
  WEBHOOK_SECRET: string;
  MONGODB: DurableObjectNamespace;
}

export interface ParsedError {
  name: string;
  message: string;
  file: string;
  line: number | null;
  column: number | null;
  stack: string;
}
