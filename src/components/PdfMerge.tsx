import { useRef, useState } from "react";
import { FileText, GripVertical, X, Trash2, Loader2, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { withTimeout, pdfErrorMessage, loadPdfLib } from "../lib/pdfjs";
import { downloadBlob, formatBytes, isPdf, moveItem } from "../lib/format";
import { DropZone, ErrorBox, MoveButtons } from "./ToolUi";

type Item = { id: string; file: File; pages: number; size: number };

export function PdfMerge() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultPages, setResultPages] = useState<number | null>(null);
  const [error, setError] = useState("");
  const dragId = useRef<string | null>(null);

  async function add(files: File[]) {
    setError("");
    setLoading(true);
    const next: Item[] = [];
    const errors: string[] = [];
    for (const file of files) {
      if (!isPdf(file)) {
        errors.push(`"${file.name}" PDF değil.`);
        continue;
      }
      try {
        const doc = await loadPdfLib(await file.arrayBuffer());
        next.push({ id: crypto.randomUUID(), file, pages: doc.getPageCount(), size: file.size });
      } catch (e) {
        errors.push(`"${file.name}": ${pdfErrorMessage(e)}`);
      }
    }
    setItems((p) => [...p, ...next]);
    setResultPages(null);
    setError(errors.join(" "));
    setLoading(false);
  }

  const remove = (id: string) => {
    setItems((p) => p.filter((x) => x.id !== id));
    setResultPages(null);
  };
  const clear = () => {
    setItems([]);
    setResultPages(null);
    setError("");
  };
  const move = (from: number, to: number) => {
    setItems((p) => moveItem(p, from, to));
    setResultPages(null);
  };

  function onDragOverItem(e: React.DragEvent, id: string) {
    if (!dragId.current) return;
    e.preventDefault();
    if (dragId.current === id) return;
    setItems((p) => moveItem(p, p.findIndex((x) => x.id === dragId.current), p.findIndex((x) => x.id === id)));
  }

  async function merge() {
    if (items.length < 2 || busy) return;
    setBusy(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const it of items) {
        const src = await loadPdfLib(await it.file.arrayBuffer());
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const bytes = await withTimeout(merged.save());
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setResultPages(merged.getPageCount());
      downloadBlob(blob, "birlestirilmis.pdf");
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
        multiple
        onFiles={add}
        title="Birleştirmek için PDF'leri sürükleyin veya seçin"
        subtitle="Sıralamayı sonradan değiştirebilirsiniz · Tarayıcınızda işlenir · Sunucuya gönderilmez"
      />

      <ErrorBox>{error}</ErrorBox>

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Dosyalar okunuyor...
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={clear}
              disabled={busy}
              className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" /> Tümünü Temizle
            </button>
            <span className="text-sm text-slate-500">
              {items.length} PDF · {items.reduce((s, i) => s + i.pages, 0)} sayfa
            </span>
            <button
              onClick={merge}
              disabled={busy || loading || items.length < 2}
              className="ml-auto px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF'leri Birleştir ve İndir
            </button>
          </div>

          {items.length < 2 && <p className="mt-2 text-xs text-slate-500">Birleştirmek için en az 2 PDF ekleyin.</p>}

          {resultPages !== null && (
            <div className="mt-3 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-xl p-3">
              {items.length} dosya birleştirildi — toplam {resultPages} sayfa.
            </div>
          )}

          <div className="mt-4 space-y-2">
            {items.map((it, i) => (
              <div
                key={it.id}
                draggable
                onDragStart={() => (dragId.current = it.id)}
                onDragEnd={() => (dragId.current = null)}
                onDragOver={(e) => onDragOverItem(e, it.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-2 sm:gap-3"
              >
                <GripVertical className="hidden sm:block w-5 h-5 text-slate-400 cursor-grab shrink-0" />
                <span className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <FileText className="hidden sm:block w-7 h-7 text-primary-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{it.file.name}</p>
                  <p className="text-xs text-slate-500">
                    {it.pages} sayfa · {formatBytes(it.size)}
                  </p>
                </div>
                <MoveButtons index={i} count={items.length} onMove={move} vertical dark={false} />
                <button
                  onClick={() => remove(it.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
