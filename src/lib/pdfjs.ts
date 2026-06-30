import * as pdfjsLib from "pdfjs-dist";
// Bundle the worker via Vite so it always matches the installed pdfjs-dist version
// and never depends on a CDN being reachable.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

export { pdfjsLib };

export const PDF_LOAD_ERROR =
  "PDF yüklenirken bir hata oluştu. Lütfen dosyanın geçerli bir PDF olduğunu kontrol edin ve tekrar deneyin.";
export const PDF_TIMEOUT_ERROR =
  "İşlem zaman aşımına uğradı. Daha küçük bir dosya deneyin veya sayfayı yenileyin.";

export function withTimeout<T>(promise: Promise<T>, ms = 30000): Promise<T> {
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
  if (e instanceof Error && e.message === "TIMEOUT") return PDF_TIMEOUT_ERROR;
  return PDF_LOAD_ERROR;
}
