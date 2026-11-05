/**
 * Sayfa aralığı metnini çözümler: "1-3, 5, 8-10" → [[0,1,2],[4],[7,8,9]] (0 tabanlı gruplar).
 * Word/telefon klavyesinden gelen uzun tireler (–, —) ve noktalı virgül de kabul edilir.
 * Geçersiz girişte Error("invalid") fırlatır.
 */
export function parsePageRanges(input: string, total: number): number[][] {
  const normalized = input
    .normalize("NFKC")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/;/g, ",");
  const parts = normalized.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) throw new Error("invalid");
  const groups: number[][] = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) throw new Error("invalid");
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < a || b > total) throw new Error("invalid");
    const arr: number[] = [];
    for (let i = a; i <= b; i++) arr.push(i - 1);
    groups.push(arr);
  }
  return groups;
}

/** Aralıktaki tüm sayfa numaralarını (1 tabanlı) tek bir küme olarak döndürür. */
export function pageNumberSet(input: string, total: number): Set<number> {
  const set = new Set<number>();
  for (const g of parsePageRanges(input, total)) for (const i of g) set.add(i + 1);
  return set;
}
