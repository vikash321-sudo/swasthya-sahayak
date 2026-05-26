export const WM = {
  tauko: "टाउको",
  dukhxa: "दुख्छ",
  dukhcha: "दुख्छ",
  jworo: "ज्वरो",
  jwaro: "ज्वरो",
  fever: "ज्वरो",
  pet: "पेट",

  khoki: "खोकी",
  khokhi: "खोकी",
  khansi: "खोकी",
  cough: "खोकी",

  ulti: "उल्टी",
  chhati: "छाती",
  chest: "छाती",
  chakkar: "चक्कर",
  sas: "सास",
  saas: "सास",
  garho: "गाह्रो",
  paani: "पानी",
  dherai: "धेरै"
};

export function r2n(t) {
  if (!t || /[\u0900-\u097F]/.test(t)) return null;

  const w = t
    .toLowerCase()
    .split(/\s+/)
    .map((x) => WM[x] || x)
    .join(" ");

  return w !== t.toLowerCase() ? w : null;
}

export function isRom(t) {
  if (!t || /[\u0900-\u097F]/.test(t)) return false;

  return Object.keys(WM).some((k) =>
    t.toLowerCase().includes(k)
  );
}