import { useRef, useState } from "react";
import { Upload, Download, ZoomIn, X, Loader2, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { pdfjsLib } from "../lib/pdfjs";
import { downloadBlob } from "../lib/format";

type Page = {
  id: string;
  pdfName: string;
  pdfIndex: number;
  pageNumber: number;
  preview: string;
  selected: boolean;
};

type PdfFile = { name: string; doc: any };

const QUALITY: Record<string, number> = {
  "Standart (108 DPI)": 1.5,
  "İyi (144 DPI)": 2.0,
  "Yüksek (180 DPI)": 2.5,
  "HD (216 DPI)": 3.0,
};

export function PdfToImage() {
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState("İyi (144 DPI)");
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");
  const [lightbox, setLightbox] = useState<Page | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | File[]) {
    setLoading(true);
    const newPdfs: PdfFile[] = [...pdfs];
    const newPages: Page[] = [...pages];
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith(".pdf")) continue;
      const buf = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const pdfIndex = newPdfs.length;
      newPdfs.push({ name: file.name, doc });
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        newPages.push({
          id: `${pdfIndex}-${i}`,
          pdfName: file.name,
          pdfIndex,
          pageNumber: i,
          preview: canvas.toDataURL("image/jpeg", 0.7),
          selected: true,
        });
      }
    }
    setPdfs(newPdfs);
    setPages(newPages);
    setLoading(false);
  }

  function reset() {
    setPdfs([]);
    setPages([]);
    setRangeInput("");
    setRangeError("");
  }

  function toggle(id: string) {
    setPages((p) => p.map((x) => (x.id === id ? { ...x, selected: !x.selected } : x)));
  }
  function selectAll() {
    setPages((p) => p.map((x) => ({ ...x, selected: true })));
  }
  function clearSel() {
    setPages((p) => p.map((x) => ({ ...x, selected: false })));
  }

  function applyRange() {
    setRangeError("");
    if (pdfs.length !== 1) return;
    const total = pdfs[0].doc.numPages;
    const set = new Set<number>();
    try {
      const parts = rangeInput.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.includes("-")) {
          const [a, b] = part.split("-").map((n) => parseInt(n, 10));
          if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > total) throw new Error();
          for (let i = a; i <= b; i++) set.add(i);
        } else {
          const n = parseInt(part, 10);
          if (!Number.isInteger(n) || n < 1 || n > total) throw new Error();
          set.add(n);
        }
      }
    } catch {
      setRangeError(`Geçersiz aralık. 1-${total} arasında olmalı.`);
      return;
    }
    setPages((p) => p.map((x) => ({ ...x, selected: set.has(x.pageNumber) })));
  }

  async function renderPage(page: Page): Promise<Blob> {
    const pdf = pdfs[page.pdfIndex].doc;
    const p = await pdf.getPage(page.pageNumber);
    const scale = QUALITY[quality];
    const viewport = p.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    await p.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), mime, 0.92));
  }

  async function downloadOne(page: Page) {
    const blob = await renderPage(page);
    const base = page.pdfName.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${base}_sayfa-${page.pageNumber}.${format === "jpeg" ? "jpg" : format}`);
  }

  async function downloadZip() {
    const sel = pages.filter((p) => p.selected);
    if (!sel.length) return;
    setLoading(true);
    const zip = new JSZip();
    for (const page of sel) {
      const blob = await renderPage(page);
      const base = page.pdfName.replace(/\.pdf$/i, "");
      zip.file(`${base}_sayfa-${page.pageNumber}.${format === "jpeg" ? "jpg" : format}`, blob);
    }
    const out = await zip.generateAsync({ type: "blob" });
    downloadBlob(out, "pdf-gorseller.zip");
    setLoading(false);
  }

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition ${
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-300 dark:border-slate-700 hover:border-primary-400"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-primary-500 mb-3" />
        <p className="font-semibold">PDF yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-sm text-slate-500 mt-1">Birden fazla PDF yükleyebilirsiniz · Sınır yok</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...
        </div>
      )}

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
              <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0">
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
              <select value={quality} onChange={(e) => setQuality(e.target.value)} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0">
                {Object.keys(QUALITY).map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
              <button
                disabled={!selectedCount || loading}
                onClick={downloadZip}
                className="px-4 py-1.5 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Seçilenleri ZIP İndir ({selectedCount})
              </button>
            </div>
          </div>

          {pdfs.length === 1 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="text-sm font-medium">Sayfa aralığı:</label>
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="örn: 1-5, 8, 11-13"
                className="flex-1 min-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
              />
              <button onClick={applyRange} className="px-4 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold">
                Uygula
              </button>
              {rangeError && <p className="w-full text-red-600 text-sm">{rangeError}</p>}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pages.map((p) => (
              <div key={p.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800">
                  <img src={p.preview} alt={`Sayfa ${p.pageNumber}`} className="w-full h-full object-contain" />
                </div>
                <input
                  type="checkbox"
                  checked={p.selected}
                  onChange={() => toggle(p.id)}
                  className="absolute top-2 left-2 w-5 h-5 accent-primary-600 cursor-pointer"
                />
                {pdfs.length > 1 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-md bg-slate-900/80 text-white max-w-[60%] truncate">
                    {p.pdfName}
                  </span>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs rounded-md bg-slate-900/80 text-white">Sayfa {p.pageNumber}</span>
                <button
                  onClick={() => downloadOne(p)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white"
                  aria-label="İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightbox(p)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  aria-label="Büyüt"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.preview} alt="" className="w-full max-h-[85vh] object-contain rounded-lg" />
            <button onClick={() => setLightbox(null)} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full" aria-label="Kapat">
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => downloadOne(lightbox)}
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
