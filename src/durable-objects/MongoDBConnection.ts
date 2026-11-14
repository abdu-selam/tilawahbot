import { DurableObject } from "cloudflare:workers";
import connectDB from "../configs/db.config.js";
import { createBot } from "../bot/bot.js";
import type { Env } from "../types/bot.types.js";
import seed, { load } from "../seed.js";

export class MongoDBConnection extends DurableObject<Env> {
  private bot;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    this.bot = createBot(env.token, env);
  }

  async fetch(request: Request): Promise<Response> {
    try {
      await this.bot.init();
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405,
        });
      }

      await connectDB(this.env.mongo);
      await seed();
      await load();

      const update = await request.json();

      await this.bot.handleUpdate(update as any);

      return new Response("OK", {
        status: 200,
      });
    } catch (error) {
      console.error("Bot processing error:", error);

      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  }
}
