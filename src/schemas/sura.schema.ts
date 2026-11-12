import Qari from "../models/qari.model.js";
import Sura from "../models/sura.model.js";

type SuraType = {
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
    const allSura = await Sura.find();

    const suras = allSura.map((sura) => ({
      id: sura.id,
      nameEn: sura.nameEn,
      nameAr: sura.nameAr,
      number: sura.number,
      verses: sura.verses,
      revelation: sura.revelation,
    }));

    this.allSura = structuredClone(suras);
    this.length = suras.length;
  }

  static find(page: number): { suras: SuraType[]; total: number } {
    const start = page * 15;
    const end = start + 15;
    const suras = structuredClone(this.allSura.slice(start, end));

    return { suras, total: this.length };
  }

  static async add(
    nameEn: string,
    nameAr: string,
    number: number,
    verses: number,
    revelation: string,
  ): Promise<boolean> {
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
}

export default SuraClass;
