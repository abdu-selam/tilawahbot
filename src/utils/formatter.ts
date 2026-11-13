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
