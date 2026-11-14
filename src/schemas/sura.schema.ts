import { Sura } from "../models/models.js";

export type SuraType = {
  id: string;
  nameEn: string;
  nameAr: string;

  number: number;
  verses: number;
  revelation: string;
};

class SuraClass {
  static allSura: SuraType[] = [];
  static length: number = 0;

  static async fill() {
    const allSura = await Sura.find().lean();

    this.allSura = allSura.map((sura) => ({
      id: sura._id.toString(),
      nameEn: sura.nameEn,
      nameAr: sura.nameAr,
      number: sura.number,
      verses: sura.verses,
      revelation: sura.revelation,
    }));

    this.length = this.allSura.length;
  }

  static find(page: number = 0): SuraType[] {
    const start = page * 15;
    const end = start + 15 < this.length ? start + 15 : this.length;

    const selected = this.allSura.slice(start, end);
    const suras = structuredClone(selected);

    return suras;
  }

  static async add({
    nameEn,
    nameAr,
    number,
    verses,
    revelation,
  }: {
    nameEn: string;
    nameAr: string;
    number: number;
    verses: number;
    revelation: string;
  }): Promise<boolean> {
    const find = this.findOne(number);

    if (find) return true;
    const sura = new Sura({
      nameEn,
      nameAr,
      number,
      verses,
      revelation,
    });

    await sura.save();
    this.allSura.push({
      id: sura.id,
      nameEn,
      nameAr,
      number,
      verses,
      revelation,
    });

    return true;
  }

  static findOne(number: number): SuraType | null {
    const sura = this.allSura.find((sura) => sura.number == number);
    if (!sura) return null;

    return sura;
  }

  static findById(id: string): SuraType | null {
    const sura = this.allSura.find((sura) => sura.id == id);
    if (!sura) return null;

    return sura;
  }
}

export default SuraClass;
