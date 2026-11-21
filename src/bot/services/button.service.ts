import {
  GrammyError,
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import SuraClass, { type SuraType } from "../../schemas/sura.schema.js";
import type { QariType } from "../../schemas/qari.schema.js";

export const generateSuraKeyboard = (
  callback: (sura: SuraType) => string,
  next: string,
  back: string,
  page: number = 0,
): InlineKeyboard | null => {
  const suras = SuraClass.find(page);
  if (!suras.length || page < 0) {
    return null;
  }
  const total = Math.ceil(114 / 15);

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

  keyboard
    .text("Back", back)
    .text(`Page ${page + 1} / ${total}`, "page_count")
    .text("Next", next);

  return keyboard;
};

export const generateQariKeyboard = (
  qaris: QariType[],
  next: string,
  back: string,
  callback: (qari: QariType) => string,
  total: number,
  page: number = 0,
): InlineKeyboard => {
  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const qari of qaris) {
    const data = callback(qari);
    keyboard.text(qari.name, data);
    if (i % 2 === 1 || qaris.length === i + 1) {
      keyboard.row();
    }
    i++;
  }

  keyboard.text("Back", back);
  keyboard.text(`Page ${page + 1} / ${Math.ceil(total / 10)}`, "page_count");
  keyboard.text("Next", next);

  return keyboard;
};
