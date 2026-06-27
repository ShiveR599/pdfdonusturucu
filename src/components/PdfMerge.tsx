import { useRef, useState } from "react";
import { Upload, FileText, GripVertical, X, Trash2, Loader2, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { downloadBlob, formatBytes } from "../lib/format";

type Item = { id: string; file: File; pages: number; size: number };

export function PdfMerge() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [resultPages, setResultPages] = useState<number | null>(null);
  const dragId = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function add(files: FileList | File[]) {
    const next: Item[] = [];
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith(".pdf")) continue;
      try {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        next.push({ id: crypto.randomUUID(), file, pages: doc.getPageCount(), size: file.size });
      } catch {}
    }
    setItems((p) => [...p, ...next]);
    setResultPages(null);
  }

  function remove(id: string) {
    setItems((p) => p.filter((x) => x.id !== id));
  }
  function clear() {
    setItems([]);
    setResultPages(null);
  }

  function onDragStart(id: string) {
    dragId.current = id;
  }
  function onDragOverItem(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === id) return;
    setItems((p) => {
      const from = p.findIndex((x) => x.id === dragId.current);
      const to = p.findIndex((x) => x.id === id);
      if (from < 0 || to < 0) return p;
      const copy = [...p];
      const [it] = copy.splice(from, 1);
      copy.splice(to, 0, it);
      return copy;
    });
  }

  async function merge() {
    if (!items.length) return;
    setBusy(true);
    try {
      const merged = await PDFDocument.create();
      for (const it of items) {
        const buf = await it.file.arrayBuffer();
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setResultPages(merged.getPageCount());
      downloadBlob(blob, "Birlestirilmis_PDF.pdf");
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
          add(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition ${
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-300 dark:border-slate-700 hover:border-primary-400"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-primary-500 mb-3" />
        <p className="font-semibold">PDF yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-sm text-slate-500 mt-1">Birleştirmek istediğiniz PDF'leri ekleyin · Sınır yok</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple hidden onChange={(e) => e.target.files && add(e.target.files)} />
      </div>

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Tümünü Temizle
            </button>
            <span className="text-sm text-slate-500">{items.length} PDF</span>
            <button
              onClick={merge}
              disabled={busy || items.length < 1}
              className="ml-auto px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF'leri Birleştir ve İndir
            </button>
          </div>

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
                onDragStart={() => onDragStart(it.id)}
                onDragOver={(e) => onDragOverItem(e, it.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3"
              >
                <GripVertical className="w-5 h-5 text-slate-400 cursor-grab shrink-0" />
                <span className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <FileText className="w-7 h-7 text-primary-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{it.file.name}</p>
                  <p className="text-xs text-slate-500">
                    {it.pages} sayfa · {formatBytes(it.size)}
                  </p>
                </div>
                <button onClick={() => remove(it.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kaldır">
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