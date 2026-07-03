import { useRef, useState } from "react";
import { Upload, Loader2, Download, Trash2, GripVertical, RotateCw, RotateCcw, RefreshCcw, AlertCircle } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { pdfjsLib, withTimeout, pdfErrorMessage } from "../lib/pdfjs";
import { downloadBlob } from "../lib/format";

type Page = { id: string; srcIndex: number; rotation: number; preview: string; w: number; h: number };

export function PdfPagesEdit() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [originalPages, setOriginalPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const dragId = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
    setPages([]);
    setOriginalPages([]);
    setError("");
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      const doc = await withTimeout(pdfjsLib.getDocument({ data: buf.slice(0) }).promise);
      const list: Page[] = [];
      setProgress({ done: 0, total: doc.numPages });
      for (let i = 1; i <= doc.numPages; i++) {
        const p = await doc.getPage(i);
        const vp = p.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await withTimeout(p.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise);
        const preview = canvas.toDataURL("image/jpeg", 0.75);
        const w = vp.width;
        const h = vp.height;
        canvas.width = 0;
        canvas.height = 0;
        const item: Page = {
          id: crypto.randomUUID(),
          srcIndex: i - 1,
          rotation: 0,
          preview,
          w,
          h,
        };
        list.push(item);
        setPages([...list]);
        setProgress({ done: i, total: doc.numPages });
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      setOriginalPages(list);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  function clear() {
    setFile(null);
    setPages([]);
    setOriginalPages([]);
  }
  function resetEdits() {
    setPages(originalPages.map((p) => ({ ...p, rotation: 0 })));
  }
  function removePage(id: string) {
    setPages((p) => p.filter((x) => x.id !== id));
  }
  function rotate(id: string, delta: number) {
    setPages((p) => p.map((x) => (x.id === id ? { ...x, rotation: (((x.rotation + delta) % 360) + 360) % 360 } : x)));
  }

  function onDragStart(id: string) {
    dragId.current = id;
  }
  function onDragOverItem(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === id) return;
    setPages((p) => {
      const from = p.findIndex((x) => x.id === dragId.current);
      const to = p.findIndex((x) => x.id === id);
      if (from < 0 || to < 0) return p;
      const copy = [...p];
      const [it] = copy.splice(from, 1);
      copy.splice(to, 0, it);
      return copy;
    });
  }

  async function apply() {
    if (!file || !pages.length) return;
    setBusy(true);
    setError("");
    try {
      const buf = await file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p.srcIndex));
      copied.forEach((page, i) => {
        const rot = pages[i].rotation;
        if (rot) {
          const existing = page.getRotation().angle || 0;
          page.setRotation(degrees((existing + rot) % 360));
        }
        out.addPage(page);
      });
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}_duzenlenmis.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

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
          if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition ${
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-300 dark:border-slate-700 hover:border-primary-400"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-primary-500 mb-3" />
        <p className="font-semibold">Düzenlemek için bir PDF seçin</p>
        <p className="text-sm text-slate-500 mt-1">Sayfaları sıralayın, döndürün veya silin · Sunucuya gönderilmez</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" hidden onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {progress ? `İşleniyor... ${progress.done}/${progress.total} sayfa` : "İşleniyor..."}
        </div>
      )}

      {file && pages.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium truncate flex-1 min-w-0">{file.name}</span>
            <span className="text-sm text-slate-500">{pages.length} sayfa</span>
            <button onClick={resetEdits} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1">
              <RefreshCcw className="w-4 h-4" /> Sıfırla
            </button>
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
            <button
              onClick={apply}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Değişiklikleri Uygula ve İndir
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragOver={(e) => onDragOverItem(e, p.id)}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group"
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.preview}
                    alt={`Sayfa ${idx + 1}`}
                    className="max-w-full max-h-full object-contain transition-transform"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                  />
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-primary-600 text-white font-semibold">
                  {idx + 1}
                </span>
                <GripVertical className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow cursor-grab" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center justify-center gap-1">
                  <button onClick={() => rotate(p.id, -90)} className="p-1.5 rounded bg-white/20 hover:bg-white/30" aria-label="Sola Döndür">
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => rotate(p.id, 90)} className="p-1.5 rounded bg-white/20 hover:bg-white/30" aria-label="Sağa Döndür">
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => removePage(p.id)} className="p-1.5 rounded bg-red-500/80 hover:bg-red-600" aria-label="Sayfayı Sil">
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}