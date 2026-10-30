import { useEffect, useRef, useState } from "react";
import { Loader2, Download, Trash2, GripVertical, RotateCw, RotateCcw, RefreshCcw } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { pdfjsLib, withTimeout, pdfErrorMessage, loadPdfLib } from "../lib/pdfjs";
import { downloadBlob, isPdf, moveItem } from "../lib/format";
import { DropZone, ErrorBox, MoveButtons, Progress } from "./ToolUi";

type Page = { id: string; srcIndex: number; rotation: number; preview: string };

export function PdfPagesEdit() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [originalPages, setOriginalPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const dragId = useRef<string | null>(null);
  const generation = useRef(0);

  useEffect(() => () => void generation.current++, []);

  async function loadFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    if (!isPdf(f)) {
      setError("Lütfen bir PDF dosyası seçin.");
      return;
    }
    const gen = ++generation.current;
    setFile(f);
    setPages([]);
    setOriginalPages([]);
    setError("");
    setLoading(true);
    let doc: any;
    try {
      doc = await withTimeout(pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise);
      const list: Page[] = [];
      setProgress({ done: 0, total: doc.numPages });
      for (let i = 1; i <= doc.numPages; i++) {
        if (gen !== generation.current) return;
        const p = await doc.getPage(i);
        const vp = p.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("CANVAS");
        await withTimeout(p.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise);
        const preview = canvas.toDataURL("image/jpeg", 0.75);
        canvas.width = 0;
        canvas.height = 0;
        list.push({ id: crypto.randomUUID(), srcIndex: i - 1, rotation: 0, preview });
        setPages([...list]);
        setProgress({ done: i, total: doc.numPages });
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      setOriginalPages(list);
    } catch (e) {
      if (gen === generation.current) {
        setError(pdfErrorMessage(e));
        setFile(null);
        setPages([]);
      }
    } finally {
      doc?.destroy();
      if (gen === generation.current) {
        setLoading(false);
        setProgress(null);
      }
    }
  }

  function clear() {
    generation.current++;
    setFile(null);
    setPages([]);
    setOriginalPages([]);
    setError("");
    setLoading(false);
    setProgress(null);
  }
  const resetEdits = () => setPages(originalPages.map((p) => ({ ...p, rotation: 0 })));
  const removePage = (id: string) => setPages((p) => p.filter((x) => x.id !== id));
  const rotate = (id: string, delta: number) =>
    setPages((p) => p.map((x) => (x.id === id ? { ...x, rotation: (((x.rotation + delta) % 360) + 360) % 360 } : x)));
  const move = (from: number, to: number) => setPages((p) => moveItem(p, from, to));

  function onDragOverItem(e: React.DragEvent, id: string) {
    if (!dragId.current) return;
    e.preventDefault();
    if (dragId.current === id) return;
    setPages((p) => moveItem(p, p.findIndex((x) => x.id === dragId.current), p.findIndex((x) => x.id === id)));
  }

  async function apply() {
    if (!file || !pages.length || busy || loading) return;
    setBusy(true);
    setError("");
    try {
      const src = await loadPdfLib(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(
        src,
        pages.map((p) => p.srcIndex),
      );
      copied.forEach((page, i) => {
        const rot = pages[i].rotation;
        if (rot) {
          const existing = page.getRotation().angle || 0;
          page.setRotation(degrees((((existing + rot) % 360) + 360) % 360));
        }
        out.addPage(page);
      });
      const bytes = await out.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, `${file.name.replace(/\.pdf$/i, "")}_duzenlenmis.pdf`);
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <DropZone
        accept=".pdf,application/pdf"
        onFiles={loadFile}
        title="Düzenlemek için bir PDF seçin"
        subtitle="Sayfaları sıralayın, döndürün veya silin · Sunucuya gönderilmez"
      />

      <ErrorBox>{error}</ErrorBox>

      {loading && progress && <Progress done={progress.done} total={progress.total} />}

      {file && pages.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium truncate flex-1 min-w-0">{file.name}</span>
            <span className="text-sm text-slate-500">{pages.length} sayfa</span>
            <button
              onClick={resetEdits}
              disabled={loading}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <RefreshCcw className="w-4 h-4" /> Sıfırla
            </button>
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
            <button
              onClick={apply}
              disabled={busy || loading}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Değişiklikleri Uygula ve İndir
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Sıralamak için sayfaları sürükleyin veya ok düğmelerine dokunun.</p>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => (dragId.current = p.id)}
                onDragEnd={() => (dragId.current = null)}
                onDragOver={(e) => onDragOverItem(e, p.id)}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group"
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={p.preview}
                    alt={`Sayfa ${idx + 1}`}
                    className="max-w-[75%] max-h-[75%] object-contain transition-transform shadow"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                  />
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-primary-600 text-white font-semibold">{idx + 1}</span>
                <GripVertical className="hidden sm:block absolute top-2 right-2 w-5 h-5 text-slate-500 drop-shadow cursor-grab" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center justify-center gap-1 flex-wrap">
                  <MoveButtons index={idx} count={pages.length} onMove={move} />
                  <button onClick={() => rotate(p.id, -90)} className="p-1.5 rounded bg-white/20 hover:bg-white/30" aria-label="Sola döndür">
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => rotate(p.id, 90)} className="p-1.5 rounded bg-white/20 hover:bg-white/30" aria-label="Sağa döndür">
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => removePage(p.id)}
                    disabled={pages.length === 1}
                    className="p-1.5 rounded bg-red-500/80 hover:bg-red-600 disabled:opacity-30"
                    aria-label="Sayfayı sil"
                  >
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
