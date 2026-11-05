import * as pdfjsLib from "pdfjs-dist";
// Bundle the worker via Vite so it always matches the installed pdfjs-dist version
// and never depends on a CDN being reachable.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument } from "pdf-lib";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

export { pdfjsLib };

export const PDF_LOAD_ERROR =
  "PDF işlenirken bir hata oluştu. Lütfen dosyanın geçerli ve bozuk olmayan bir PDF olduğunu kontrol edip tekrar deneyin.";
export const PDF_TIMEOUT_ERROR =
  "İşlem zaman aşımına uğradı. Dosya cihazınız için çok büyük olabilir; daha küçük bir dosya veya daha düşük kalite deneyin.";
export const PDF_ENCRYPTED_ERROR =
  "Bu PDF şifreli veya korumalı. Şifreli PDF'ler desteklenmiyor; önce şifresini kaldırıp tekrar deneyin.";
export const MEMORY_ERROR =
  "Cihazınızın belleği bu işlem için yetmedi. Daha az sayfa/dosya seçin veya daha düşük kalite deneyin.";

export function withTimeout<T>(promise: Promise<T>, ms = 60000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("TIMEOUT")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

// Telefon tarayıcılarının tuval sınırı (~16 megapiksel). Bunu aşan tuval boş/hatalı çıkar.
export const MAX_PIXELS = 16_000_000;

/** İstenen ölçekte görünüm alanı; tuval sınırını aşacaksa ölçeği orantılı düşürür. */
export function cappedViewport(page: any, scale: number): any {
  const vp = page.getViewport({ scale });
  const area = vp.width * vp.height;
  return area > MAX_PIXELS ? page.getViewport({ scale: scale * Math.sqrt(MAX_PIXELS / area) }) : vp;
}

/**
 * Bir PDF sayfasını tuvale çizer. Süre dolarsa arka plandaki çizimi de gerçekten iptal eder
 * (aksi hâlde zaman aşımından sonra da işlemci ve bellek kullanmaya devam ederdi).
 */
export async function renderPage(
  page: any,
  canvas: HTMLCanvasElement,
  viewport: any,
  opts: { whiteBg?: boolean; ms?: number } = {},
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("CANVAS");
  if (opts.whiteBg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const task = page.render({ canvasContext: ctx, viewport, canvas } as any);
  try {
    await withTimeout(task.promise as Promise<void>, opts.ms ?? 60000);
  } catch (e) {
    try {
      task.cancel();
    } catch {
      /* zaten bitmiş olabilir */
    }
    throw e;
  }
}

/** Küçük önizleme görseli (JPEG veri adresi) üretir ve tuvali hemen serbest bırakır. */
export async function renderThumbnail(doc: any, pageNumber: number, scale: number, quality = 0.7): Promise<string> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  try {
    await renderPage(page, canvas, viewport, { whiteBg: true });
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
    page.cleanup?.();
  }
}

/** Önizlemeleri tek tek değil, gruplar hâlinde ekrana basmak için yardımcı (yüzlerce sayfada akıcılık). */
export function createBatcher<T>(onFlush: (items: T[]) => void, size = 8) {
  let buf: T[] = [];
  const flush = () => {
    if (!buf.length) return;
    const items = buf;
    buf = [];
    onFlush(items);
  };
  const push = (item: T) => {
    buf.push(item);
    if (buf.length >= size) flush();
  };
  return { push, flush };
}

export function pdfErrorMessage(e: unknown): string {
  if (e instanceof Error) {
    if (e.message === "TIMEOUT") return PDF_TIMEOUT_ERROR;
    if (e.message === "ENCRYPTED" || e.name === "PasswordException") return PDF_ENCRYPTED_ERROR;
    if (e.message === "CANVAS" || e instanceof RangeError) return MEMORY_ERROR;
  }
  return PDF_LOAD_ERROR;
}

/** pdf-lib ile PDF açar; şifreli dosyalarda anlaşılır hata verir (aksi hâlde bozuk çıktı oluşur). */
export async function loadPdfLib(data: ArrayBuffer): Promise<PDFDocument> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  if (doc.isEncrypted) throw new Error("ENCRYPTED");
  return doc;
}
