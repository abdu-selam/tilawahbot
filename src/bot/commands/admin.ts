import { InlineKeyboard, type CommandContext, type Context } from "grammy";
import QariClass from "../../schemas/qari.schema.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import { formatKeybord, formatMessage } from "../../utils/formatter.js";
import type {
  CtxForMessage,
  CtxWithPicture,
  Env,
  EnvGeneral,
} from "../../types/bot.types.js";
import { Recite, User } from "../../models/models.js";
import Announce from "../../schemas/announce.schema.js";
import { addKeyboardText } from "../templates/start.js";

export const addAdmin = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  const text = ctx.match.trim();

  const user = await User.findOne({ username: text } as any);
  if (!user) {
    await ctx.reply("User not found");
    return;
  }

  user.utype = "admin";

  await user.save();

  await ctx.reply(
    `User <a href="tg://user?id=${user.uid}">${user.username}</a> has been made an Admin`,
    {
      parse_mode: "HTML",
    },
  );
};

export const stopUpload = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  if (!QariClass.status) {
    await ctx.reply(`There is no started upload`);
    return;
  }

  const stoped = QariClass.stopAdd();

  await ctx.reply(`Uploading of Qari: ${stoped?.name} has been stopped`);
};

export const startUpload = async (
  ctx: CtxWithPicture,
  env: EnvGeneral | Env,
) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  const message = ctx.msg;
  if (!message.caption) {
    if (Announce.status === "image") {
      Announce.addImage(message.photo.at(-1)!.file_id);
      await ctx.reply("Image saved please type your message!");
      return;
    }
    await ctx.reply("Please give valid message");
    return;
  }

  const formmated = formatMessage(message.caption);
  if (!formmated) {
    await ctx.reply("Please give valid message");
    return;
  }

  if (!message.photo) {
    await ctx.reply("Please provide Qari image");
    return;
  }

  let image = message.photo.at(-1)!.file_id;

  if (!image) {
    await ctx.reply("Please provide Qari image");
    return;
  }

  const upload = await ctx.api.sendPhoto(env.pictures, image);
  image = upload.photo.at(-1)!.file_id;

  const qari = await QariClass.add(formmated.nameEn, formmated.nameAr, image);

  QariClass.startAdd(qari.id);
  await ctx.reply(`Qari ${qari.name} upload has been started`);
};

export const listAllQari = async (
  ctx: CommandContext<Context>,
  env: EnvGeneral | Env,
) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  const { qaris } = QariClass.find({ all: true });

  const format = qaris
    .map((qari) => {
      if (qari.uploaded === 114) {
        return `<blockquote>${qari.name}: Upload completed</blockquote>\n`;
      }
      return `<a href="https://t.me/${env.bot}?start=upload_${qari.id}">${qari.name}: total uploaded ${qari.uploaded}</a>\n`;
    })
    .join("\n");

  await ctx.reply(
    `Total qari: ${qaris.length}
    
${format}`,
    {
      parse_mode: "HTML",
    },
  );
};

export const startUploadFromExist = async (ctx: CommandContext<Context>) => {
  const qariId = ctx.match.split("_")[1]!;

  const qari = QariClass.startAdd(qariId);
  if (!qari) {
    await ctx.reply("This qari does not exist");
    return;
  }

  if (qari.uploaded === 114) {
    await ctx.reply("This qari has all sura upload");
    QariClass.stopAdd();
    return;
  }

  const recites = await Recite.countDocuments({ qari: qariId });
  if (recites === 114) {
    await ctx.reply("This qari has all sura upload");
    QariClass.stopAdd();
    return;
  }

  QariClass.current = recites + 1;

  await ctx.reply(`Qari ${qari.name} upload has been started`);
};

export const currentUpload = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  if (!QariClass.status) {
    ctx.reply("There is no started qari");
    return;
  }

  await ctx.reply(`Qari ${QariClass.qari?.name} upload has been started`);
};

export const announce = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;

  Announce.start();

  await ctx.reply("Announce started!");
};

export const announceMessage = async (ctx: CtxForMessage) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  if (!["message", "keyboard"].includes(Announce.status)) {
    await ctx.reply("Announcment is not started");
    return;
  }

  const message = ctx.msg.text;
  if (!message) {
    await ctx.reply("Please type valid message");
    return;
  }

  if (Announce.status === "message") {
    Announce.addMessage(message);
    await ctx.reply(addKeyboardText, {
      parse_mode: "HTML",
    });
    return;
  }

  const values = formatKeybord(message);

  Announce.addKeyboard(values ?? []);
  await ctx.reply(
    "Keyboards added! announce with /post or check with /showanounce or /clearanounce for clearing anounce",
  );
};

export const showAnnounce = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  const announce = Announce.getMessage();

  const keyboard = new InlineKeyboard();

  announce.keybords.forEach(({ text, data, type }) => {
    if (type === "url") {
      keyboard.url(text, data);
    } else {
      keyboard.text(text, data);
    }
  });

  if (!announce.text) {
    await ctx.reply("There is no announcement");
    return;
  }

  if (announce.image) {
    await ctx.replyWithPhoto(announce.image, {
      caption: announce.text,
      reply_markup: keyboard,
      parse_mode: "HTML",
    });

    return;
  }

  await ctx.reply(announce.text, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
};

export const clearAnnounce = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  Announce.clear();
  await ctx.reply("Announcement has been cleared");
};

export const postAnnouncement = async (ctx: CommandContext<Context>) => {
  const isAdmin = await checkAdmin(ctx);

  if (!isAdmin) return;
  const announce = Announce.getMessage();

  const keyboard = new InlineKeyboard();

  announce.keybords.forEach(({ text, data, type }) => {
    if (type === "url") {
      keyboard.url(text, data);
    } else {
      keyboard.text(text, data);
    }
  });

  if (!announce.text) {
    await ctx.reply("There is no announcement");
    return;
  }

  const users = await User.find({ utype: "user" } as any).lean();

  const chunks: any[][] = [];

  for (let i = 0; i < users.length; i += 20) {
    chunks.push(users.slice(i, i + 20));
  }

  let i = 0;
  const interval = setInterval(async () => {
    if (i >= chunks.length) {
      clearInterval(interval);
      return;
    }

    const currChunk = chunks[i];
    i++;
    
    if (!currChunk) {
      return;
    }

    if (announce.image) {
      await Promise.all(
        currChunk.map((user) => {
          return ctx.api.sendPhoto(user.uid, announce.image, {
            caption: announce.text,
            reply_markup: keyboard,
            parse_mode: "HTML",
          });
        }),
      );
      return;
    }

    await Promise.all(
      currChunk.map((user) => {
        return ctx.api.sendMessage(user.uid, announce.text, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      }),
    );
  }, 1000);
};
