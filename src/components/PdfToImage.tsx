import { useEffect, useRef, useState } from "react";
import { Download, ZoomIn, X, Loader2, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { pdfjsLib, withTimeout, pdfErrorMessage } from "../lib/pdfjs";
import { downloadBlob, isPdf, canvasToBlob, canEncodeWebp } from "../lib/format";
import { DropZone, ErrorBox, InfoBox, Progress } from "./ToolUi";

type Page = {
  id: string;
  pdfName: string;
  pdfIndex: number;
  pageNumber: number;
  preview: string;
  selected: boolean;
};

type PdfFile = { name: string; doc: any };

// PDF'in temel çözünürlüğü 72 DPI'dır; ölçek × 72 = DPI.
const QUALITY: Record<string, number> = {
  "Standart (108 DPI)": 1.5,
  "İyi (144 DPI)": 2.0,
  "Yüksek (180 DPI)": 2.5,
  "HD (216 DPI)": 3.0,
};

// Telefon tarayıcılarının tuval sınırı (~16 megapiksel) aşılmasın.
const MAX_PIXELS = 16_000_000;

type Fmt = "jpeg" | "png" | "webp";
const MIME: Record<Fmt, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const EXT: Record<Fmt, string> = { jpeg: "jpg", png: "png", webp: "webp" };

async function renderToCanvas(doc: any, pageNumber: number, scale: number, whiteBg: boolean) {
  const p = await doc.getPage(pageNumber);
  let viewport = p.getViewport({ scale });
  const area = viewport.width * viewport.height;
  if (area > MAX_PIXELS) viewport = p.getViewport({ scale: scale * Math.sqrt(MAX_PIXELS / area) });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("CANVAS");
  if (whiteBg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  await withTimeout(p.render({ canvasContext: ctx, viewport, canvas } as any).promise);
  return canvas;
}

export function PdfToImage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [format, setFormat] = useState<Fmt>("jpeg");
  const [quality, setQuality] = useState("İyi (144 DPI)");
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");
  const [lightbox, setLightbox] = useState<{ page: Page; src: string } | null>(null);
  const [webpOk, setWebpOk] = useState(true);
  const pdfsRef = useRef<PdfFile[]>([]);
  const generation = useRef(0);

  useEffect(() => {
    setWebpOk(canEncodeWebp());
    return () => {
      generation.current++;
      pdfsRef.current.forEach((p) => p.doc.destroy?.());
    };
  }, []);

  async function handleFiles(files: File[]) {
    const gen = generation.current;
    setLoading(true);
    setError("");
    const pdfFiles = files.filter(isPdf);
    const errors: string[] = [];
    if (pdfFiles.length < files.length) errors.push(`${files.length - pdfFiles.length} dosya PDF olmadığı için atlandı.`);
    try {
      const docs: { name: string; doc: any; pdfIndex: number }[] = [];
      for (const file of pdfFiles) {
        try {
          const doc = await withTimeout(pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise);
          if (gen !== generation.current) return doc.destroy();
          const pdfIndex = pdfsRef.current.length;
          pdfsRef.current = [...pdfsRef.current, { name: file.name, doc }];
          docs.push({ name: file.name, doc, pdfIndex });
        } catch (e) {
          errors.push(`"${file.name}": ${pdfErrorMessage(e)}`);
        }
      }
      setPdfs(pdfsRef.current);
      const totalPages = docs.reduce((s, d) => s + d.doc.numPages, 0);
      let done = 0;
      setProgress({ done, total: totalPages });
      for (const { name, doc, pdfIndex } of docs) {
        for (let i = 1; i <= doc.numPages; i++) {
          if (gen !== generation.current) return;
          const canvas = await renderToCanvas(doc, i, 0.5, true);
          const preview = canvas.toDataURL("image/jpeg", 0.7);
          canvas.width = 0;
          canvas.height = 0;
          setPages((prev) => [...prev, { id: `${pdfIndex}-${i}`, pdfName: name, pdfIndex, pageNumber: i, preview, selected: true }]);
          done++;
          setProgress({ done, total: totalPages });
          await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
      }
    } catch (e) {
      errors.push(pdfErrorMessage(e));
    } finally {
      if (gen === generation.current) {
        setError(errors.join(" "));
        setLoading(false);
        setProgress(null);
      }
    }
  }

  function reset() {
    generation.current++;
    pdfsRef.current.forEach((p) => p.doc.destroy?.());
    pdfsRef.current = [];
    setPdfs([]);
    setPages([]);
    setRangeInput("");
    setRangeError("");
    setError("");
    setLoading(false);
    setProgress(null);
  }

  const toggle = (id: string) => setPages((p) => p.map((x) => (x.id === id ? { ...x, selected: !x.selected } : x)));
  const selectAll = () => setPages((p) => p.map((x) => ({ ...x, selected: true })));
  const clearSel = () => setPages((p) => p.map((x) => ({ ...x, selected: false })));

  function applyRange() {
    setRangeError("");
    if (pdfs.length !== 1) return;
    const total = pdfs[0].doc.numPages;
    const set = new Set<number>();
    const parts = rangeInput.split(",").map((s) => s.trim()).filter(Boolean);
    const bad = () => setRangeError(`Geçersiz aralık. Sayfalar 1 ile ${total} arasında olmalı (örn: 1-5, 8).`);
    if (!parts.length) return bad();
    for (const part of parts) {
      const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
      if (!m) return bad();
      const a = parseInt(m[1], 10);
      const b = m[2] ? parseInt(m[2], 10) : a;
      if (a < 1 || b < a || b > total) return bad();
      for (let i = a; i <= b; i++) set.add(i);
    }
    setPages((p) => p.map((x) => ({ ...x, selected: set.has(x.pageNumber) })));
  }

  async function renderPage(page: Page): Promise<Blob> {
    const canvas = await renderToCanvas(pdfsRef.current[page.pdfIndex].doc, page.pageNumber, QUALITY[quality], format === "jpeg");
    try {
      return await canvasToBlob(canvas, MIME[format], 0.92);
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  const fileName = (page: Page) => `${page.pdfName.replace(/\.pdf$/i, "")}_sayfa-${page.pageNumber}.${EXT[format]}`;

  async function downloadOne(page: Page) {
    try {
      downloadBlob(await renderPage(page), fileName(page));
    } catch (e) {
      setError(pdfErrorMessage(e));
    }
  }

  async function openLightbox(page: Page) {
    setLightbox({ page, src: page.preview });
    try {
      const canvas = await renderToCanvas(pdfsRef.current[page.pdfIndex].doc, page.pageNumber, 1.5, true);
      const src = canvas.toDataURL("image/jpeg", 0.85);
      canvas.width = 0;
      canvas.height = 0;
      setLightbox((cur) => (cur && cur.page.id === page.id ? { page, src } : cur));
    } catch {
      /* düşük çözünürlüklü önizleme gösterilmeye devam eder */
    }
  }

  async function downloadZip() {
    const sel = pages.filter((p) => p.selected);
    if (!sel.length) return;
    if (sel.length === 1) return downloadOne(sel[0]);
    setLoading(true);
    setError("");
    try {
      const zip = new JSZip();
      let done = 0;
      setProgress({ done, total: sel.length });
      for (const page of sel) {
        zip.file(fileName(page), await renderPage(page));
        done++;
        setProgress({ done, total: sel.length });
      }
      downloadBlob(await zip.generateAsync({ type: "blob" }), "pdf-gorseller.zip");
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div>
      <DropZone
        accept=".pdf,application/pdf"
        multiple
        onFiles={handleFiles}
        title="PDF'leri buraya sürükleyin veya seçin"
        subtitle="Birden fazla PDF · Tarayıcınızda işlenir · Sunucuya gönderilmez"
      />

      <ErrorBox>{error}</ErrorBox>

      {loading && (progress ? <Progress done={progress.done} total={progress.total} /> : (
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...
        </div>
      ))}

      {pages.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <button onClick={selectAll} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
              Tümünü Seç
            </button>
            <button onClick={clearSel} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
              Seçimi Temizle
            </button>
            <button onClick={reset} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Kaldır
            </button>
            <div className="ml-auto flex flex-wrap gap-2 items-center">
              <select
                aria-label="Çıktı formatı"
                value={format}
                onChange={(e) => setFormat(e.target.value as Fmt)}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp" disabled={!webpOk}>
                  WebP{webpOk ? "" : " (tarayıcınız desteklemiyor)"}
                </option>
              </select>
              <select
                aria-label="Çözünürlük"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
              >
                {Object.keys(QUALITY).map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
              <button
                disabled={!selectedCount || loading}
                onClick={downloadZip}
                className="px-4 py-1.5 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> {selectedCount > 1 ? `Seçilenleri ZIP İndir (${selectedCount})` : "Seçileni İndir"}
              </button>
            </div>
          </div>

          {pdfs.length === 1 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <label htmlFor="range" className="text-sm font-medium">
                Sayfa aralığı:
              </label>
              <input
                id="range"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyRange()}
                placeholder="örn: 1-5, 8, 11-13"
                inputMode="numeric"
                className="flex-1 min-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
              />
              <button onClick={applyRange} className="px-4 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold">
                Uygula
              </button>
              {rangeError && <p className="w-full text-red-600 text-sm">{rangeError}</p>}
            </div>
          )}

          {format === "png" && <InfoBox>PNG kayıpsızdır; dosyalar JPEG'e göre belirgin şekilde büyük olur.</InfoBox>}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pages.map((p) => (
              <div key={p.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button type="button" onClick={() => openLightbox(p)} className="block w-full aspect-[3/4] bg-slate-100 dark:bg-slate-800" aria-label={`Sayfa ${p.pageNumber} büyüt`}>
                  <img src={p.preview} alt={`Sayfa ${p.pageNumber}`} className="w-full h-full object-contain" />
                </button>
                <input
                  type="checkbox"
                  checked={p.selected}
                  onChange={() => toggle(p.id)}
                  aria-label={`Sayfa ${p.pageNumber} seç`}
                  className="absolute top-2 left-2 w-5 h-5 accent-primary-600 cursor-pointer"
                />
                {pdfs.length > 1 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-md bg-slate-900/80 text-white max-w-[60%] truncate">{p.pdfName}</span>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs rounded-md bg-slate-900/80 text-white pointer-events-none">Sayfa {p.pageNumber}</span>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    onClick={() => openLightbox(p)}
                    className="p-1.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100"
                    aria-label="Büyüt"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={() => downloadOne(p)} className="p-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white" aria-label="İndir">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={`Sayfa ${lightbox.page.pageNumber}`} className="w-full max-h-[85vh] object-contain rounded-lg bg-white" />
            <button onClick={() => setLightbox(null)} className="absolute top-2 right-2 p-2 bg-white/90 text-slate-900 rounded-full" aria-label="Kapat">
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => downloadOne(lightbox.page)}
              className="absolute bottom-2 right-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> İndir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
