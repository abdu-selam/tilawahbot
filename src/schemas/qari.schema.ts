import Qari from "../models/qari.model.js";

type QariType = {
  id: string;
  name: string;
  nameAr: string;
};

class QariClass {
  static allQari: QariType[] = [];
  static length: number = 0;

  static async fill() {
    const allQari = await Qari.find();

    const qaris = allQari.map((qari) => ({
      id: qari.id,
      name: qari.nameEn,
      nameAr: qari.nameAr,
    }));

    this.allQari = structuredClone(qaris);
    this.length = qaris.length;
  }

  static find(page: number): { qaris: QariType[]; total: number } {
    const start = page * 10;
    const end = start + 10;
    const qaris = structuredClone(this.allQari.slice(start, end));

    return { qaris, total: this.length };
  }

  static async add(
    name: string,
    nameAr: string,
    image: string,
  ): Promise<boolean> {
    const qari = new Qari({
      nameEn: name,
      nameAr,
      image,
    });

    await qari.save();
    this.allQari.push({
      name,
      nameAr,
      id: qari.id,
    });

    return true;
  }

  static findOne(id: string): QariType | null {
    const qari = this.allQari.find((qari) => qari.id == id);
    if (!qari) return null;

    return qari;
  }
}

export default QariClass;
