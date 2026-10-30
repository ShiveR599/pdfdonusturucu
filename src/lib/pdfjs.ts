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
