type FormatedMessage = {
  nameEn: string;
  nameAr: string;
};

export const formatMessage = (text: string): FormatedMessage | null => {
  const splitted = text.split(";").map((txt) => txt.trim());

  const result: Record<string, string> = {};

  splitted.forEach((txt) => {
    const [key, value] = txt.split(":").map((txt) => txt.trim());
    if (!key || !value) {
      return;
    }

    if (!["nameEn", "nameAr"].includes(key)) return;

    result[key] = value;
  });

  const keys = [...Object.keys(result)];
  const valids = ["nameEn", "nameAr"];

  const isValid = valids.every((valid) => keys.includes(valid));
  if (!isValid) return null;
  if (!result.nameEn || !result.nameAr) return null;

  return {
    nameEn: result.nameEn,
    nameAr: result.nameAr,
  };
};

export const formatFileSize = (byte: number): string => {
  const kbyte = byte / 1024;
  if (kbyte < 1) {
    return `${byte} byte`;
  }

  const mbyte = kbyte / 1024;
  if (mbyte < 1) {
    return `${kbyte.toFixed(2)} KB`;
  }

  const gbyte = mbyte / 1024;
  if (gbyte < 1) {
    return `${mbyte.toFixed(2)} MB`;
  }

  return `${gbyte.toFixed(2)} GB`;
};

export const formatDuration = (second: number): string => {
  const minute = second / 60;
  if (minute < 1) {
    return `${second} seconds`;
  }

  const hour = minute / 60;
  if (hour < 1) {
    const minuteInt = Math.floor(minute);
    const seconds = second - minuteInt * 60;

    return `${minuteInt} minute${minute > 1 ? "s" : ""} and ${seconds} seconds`;
  }

  const hourInt = Math.floor(hour);
  const minutes = Math.floor(minute - hourInt * 60);
  let hourStr = `${hourInt} hour${hourInt > 1 ? "s" : ""} `;

  if (minutes > 0) {
    const minute = `${minutes} minute${minutes > 1 ? "s" : ""}`;
    hourStr += minute;
  }

  return hourStr;
};

export const isSura = (input: any): boolean => {
  const sura = Number(input);

  return (
    !Number.isNaN(sura) && sura > 0 && sura < 115 && Number.isInteger(sura)
  );
};
