import type { Env } from "./types/bot.types.js";
export { MongoDBConnection } from "./durable-objects/MongoDBConnection.js";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({
        status: "running",
        service: "Quran Recitation Bot",
      });
    }

    if (request.method !== "POST" || url.pathname !== "/telegram/webhook") {
      return new Response("Not Found", { status: 404 });
    }

    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");

    if (secret !== env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    try {
      const id = env.MONGODB.idFromName("quran-bot");

      const stub = env.MONGODB.get(id);

      return await stub.fetch(
        new Request("https://mongodb.internal/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: await request.text(),
        }),
      );
    } catch (error) {
      console.error("Worker error:", error);

      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  },
};
