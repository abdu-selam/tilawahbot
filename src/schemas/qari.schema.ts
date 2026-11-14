import { Qari } from "../models/models.js";

export type QariType = {
  id: string;
  name: string;
  nameAr: string;
  image: string;
};

class QariClass {
  static allQari: QariType[] = [];
  static length: number = 0;

  static status: boolean = false;
  static qari: QariType | null = null;
  static current: number = 1;

  static async fill() {
    const allQari = await Qari.find();

    const qaris = allQari.map((qari) => ({
      id: qari.id,
      name: qari.nameEn,
      nameAr: qari.nameAr,
      image: qari.image || "",
    }));

    this.allQari = structuredClone(qaris);
    this.length = qaris.length;
  }

  static find({ page = 0, all = false }: { page?: number; all?: boolean }): {
    qaris: QariType[];
    total: number;
  } {
    if (all) {
      const qaris = structuredClone(this.allQari);
      return { qaris, total: this.length };
    }
    const start = page * 10;
    const end = start + 10;
    const qaris = structuredClone(this.allQari.slice(start, end));

    return { qaris, total: this.length };
  }

  static async add(
    name: string,
    nameAr: string,
    image: string,
  ): Promise<QariType> {
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
      image,
    });

    return {
      id: qari.id,
      name: qari.nameEn,
      nameAr: qari.nameAr,
      image,
    };
  }

  static findOne(id: string): QariType | null {
    const qari = this.allQari.find((qari) => qari.id == id);
    if (!qari) return null;

    return qari;
  }

  static startAdd(id: string): QariType | null {
    const qari = this.findOne(id);
    if (!qari) {
      return null;
    }

    this.status = true;
    this.qari = structuredClone(qari);

    return qari;
  }

  static stopAdd(): QariType | null {
    this.status = false;
    const qari = structuredClone(this.qari);
    this.qari = null;
    this.current = 1;

    return qari;
  }
}

export default QariClass;
