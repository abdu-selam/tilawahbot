import {
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import SuraClass, { type SuraType } from "../../schemas/sura.schema.js";
import type { QariType } from "../../schemas/qari.schema.js";

export const generateSuraKeyboard = (
  ctx: CallbackQueryContext<Context>,
  callback: (sura: SuraType) => string,
  next: string,
  back: string,
  full: string,
  page: number = 0,
): InlineKeyboard | null => {
  const suras = SuraClass.find(page);
  if (!suras.length || page < 0) {
    return null;
  }

  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const sura of suras) {
    const data = callback(sura);
    keyboard.text(`${sura.number} (${sura.nameEn})`, data);
    if (i % 3 === 2) {
      keyboard.row();
    }
    i++;
  }

  keyboard.text("Back", back).text("Full", full).text("Next", next);

  return keyboard;
};

export const generateQariKeyboard = (
  qaris: QariType[],
  next: string,
  back: string,
): InlineKeyboard => {
  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const qari of qaris) {
    keyboard.text(qari.name, `qari:${qari.id}`);
    if (i % 2 === 1 || qaris.length === i + 1) {
      keyboard.row();
    }
    i++;
  }

  keyboard.text("Back", back);
  keyboard.text("Next", next);

  return keyboard;
};
