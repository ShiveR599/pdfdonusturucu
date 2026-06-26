import * as pdfjsLib from "pdfjs-dist";

// Match installed pdfjs-dist version
const VERSION = "4.10.38";
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${VERSION}/pdf.worker.min.mjs`;
}

export { pdfjsLib };
