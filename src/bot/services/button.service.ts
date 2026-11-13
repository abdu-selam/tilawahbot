import {
  InlineKeyboard,
  type CallbackQueryContext,
  type Context,
} from "grammy";
import SuraClass, { type SuraType } from "../../schemas/sura.schema.js";

export const generateSuraKeyboard = (
  ctx: CallbackQueryContext<Context>,
  callback: (
    sura: SuraType,
    page: number,
  ) => { each: string; next: string; back: string },
  page: number = 0,
): InlineKeyboard | null => {
  const suras = SuraClass.find(page);
  if (!suras.length || page < 0) {
    return null;
  }

  const keyboard = new InlineKeyboard();

  let i = 0;
  for (const sura of suras) {
    const data = callback(sura, page);
    keyboard.text(`${sura.number} (${sura.nameEn})`, data.each);
    if (i % 3 === 2) {
      keyboard.row();
    }
    i++;
  }

  keyboard
    .text("Back", `back_sura:${page - 1}`)
    .text("Full", "full_sura")
    .text("Next", `next_sura:${page + 1}`);

  return keyboard;
};
