export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Büyük dosyalarda indirme başlamadan adresin silinmemesi için uzun bekle.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Dizide bir öğeyi from konumundan to konumuna taşır (yeni dizi döner). */
export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Desteklenen görsel türünü döndürür (tarayıcı türü boş bıraksa bile uzantıdan anlar). */
export function imageMime(file: File): string | null {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_TYPES[ext] ?? null;
}

export function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("CANVAS"))),
      mime,
      quality,
    );
  });
}

let webpSupport: boolean | null = null;
/** Tarayıcı WebP olarak kaydedebiliyor mu? (Safari ve iPhone kaydedemez.) */
export function canEncodeWebp(): boolean {
  if (webpSupport !== null) return webpSupport;
  if (typeof document === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    webpSupport = c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    webpSupport = false;
  }
  return webpSupport;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("IMAGE"));
    img.src = url;
  });
}

/** Çok büyük görselleri tarayıcının tuval sınırına takılmayacak boyuta indirger. */
export function fitWithin(w: number, h: number, maxSide: number): { w: number; h: number } {
  const r = Math.min(1, maxSide / Math.max(w, h));
  return { w: Math.max(1, Math.round(w * r)), h: Math.max(1, Math.round(h * r)) };
}
