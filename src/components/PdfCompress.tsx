import { useRef, useState } from "react";
import { Upload, FileText, Loader2, Download, X, Trash2, AlertCircle } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib, withTimeout, pdfErrorMessage } from "../lib/pdfjs";
import { downloadBlob, formatBytes } from "../lib/format";

type Item = {
  id: string;
  file: File;
  pages: number;
  originalSize: number;
  compressed?: { blob: Blob; size: number };
  busy?: boolean;
  error?: string;
};

const LEVELS: Record<string, { scale: number; quality: number }> = {
  "Yüksek Sıkıştırma": { scale: 1.0, quality: 0.5 },
  "Orta Sıkıştırma": { scale: 1.5, quality: 0.7 },
  "Düşük Sıkıştırma / Yüksek Kalite": { scale: 2.0, quality: 0.88 },
};

export function PdfCompress() {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState("Orta Sıkıştırma");
  const [dragOver, setDragOver] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function add(files: FileList | File[]) {
    setError("");
    const next: Item[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.name.toLowerCase().endsWith(".pdf")) continue;
        const buf = await file.arrayBuffer();
        const doc = await withTimeout(pdfjsLib.getDocument({ data: buf.slice(0) }).promise);
        next.push({
          id: crypto.randomUUID(),
          file,
          pages: doc.numPages,
          originalSize: file.size,
        });
      }
      setItems((p) => [...p, ...next]);
    } catch (e) {
      setError(pdfErrorMessage(e));
    }
  }

  async function compress(it: Item): Promise<Blob> {
    const { scale, quality } = LEVELS[level];
    const buf = await it.file.arrayBuffer();
    const srcDoc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const out = await PDFDocument.create();
    for (let i = 1; i <= srcDoc.numPages; i++) {
      const p = await srcDoc.getPage(i);
      const viewport = p.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await withTimeout(p.render({ canvasContext: ctx, viewport, canvas } as any).promise);
      const jpegBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));
      const jpegBuf = await jpegBlob.arrayBuffer();
      const jpg = await out.embedJpg(jpegBuf);
      const page = out.addPage([viewport.width, viewport.height]);
      page.drawImage(jpg, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      canvas.width = 0;
      canvas.height = 0;
    }
    const bytes = await out.save();
    return new Blob([bytes as BlobPart], { type: "application/pdf" });
  }

  async function runOne(id: string) {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, busy: true, error: undefined } : x)));
    const it = items.find((x) => x.id === id)!;
    try {
      const blob = await compress(it);
      setItems((p) => p.map((x) => (x.id === id ? { ...x, busy: false, compressed: { blob, size: blob.size } } : x)));
    } catch (e) {
      setItems((p) => p.map((x) => (x.id === id ? { ...x, busy: false, error: "Sıkıştırma başarısız oldu." } : x)));
    }
  }

  async function runAll() {
    setZipping(true);
    const zip = new JSZip();
    for (const it of items) {
      try {
        const blob = it.compressed?.blob ?? (await compress(it));
        zip.file(it.file.name.replace(/\.pdf$/i, "") + "_sikistirilmis.pdf", blob);
        setItems((p) => p.map((x) => (x.id === it.id ? { ...x, compressed: { blob, size: blob.size } } : x)));
      } catch {}
    }
    const out = await zip.generateAsync({ type: "blob" });
    downloadBlob(out, "sikistirilmis-pdfler.zip");
    setZipping(false);
  }

  function remove(id: string) {
    setItems((p) => p.filter((x) => x.id !== id));
  }
  function clear() {
    setItems([]);
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
        <p className="font-semibold">PDF'leri buraya sürükleyin veya seçin</p>
        <p className="text-sm text-slate-500 mt-1">Birden fazla PDF · Sınır yok · Sunucuya gönderilmez</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple hidden onChange={(e) => e.target.files && add(e.target.files)} />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-sm font-medium">Sıkıştırma Seviyesi:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0">
              {Object.keys(LEVELS).map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
            <button
              onClick={runAll}
              disabled={zipping}
              className="ml-auto px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {zipping && <Loader2 className="w-4 h-4 animate-spin" />}
              Tümünü Sıkıştır ve ZIP İndir
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {items.map((it) => {
              const savings = it.compressed ? Math.max(0, Math.round((1 - it.compressed.size / it.originalSize) * 100)) : 0;
              return (
                <div key={it.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-wrap">
                  <FileText className="w-8 h-8 text-primary-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.file.name}</p>
                    <p className="text-xs text-slate-500">
                      {it.pages} sayfa · {formatBytes(it.originalSize)}
                      {it.compressed && (
                        <>
                          {" → "}
                          <span className="text-accent-600 font-semibold">{formatBytes(it.compressed.size)} (%{savings} tasarruf)</span>
                        </>
                      )}
                    </p>
                    {it.error && <p className="text-xs text-red-600 mt-1">{it.error}</p>}
                  </div>
                  {it.compressed ? (
                    <button
                      onClick={() => downloadBlob(it.compressed!.blob, it.file.name.replace(/\.pdf$/i, "") + "_sikistirilmis.pdf")}
                      className="px-3 py-1.5 text-sm rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-semibold inline-flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" /> İndir
                    </button>
                  ) : (
                    <button
                      onClick={() => runOne(it.id)}
                      disabled={it.busy}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                    >
                      {it.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Sıkıştır
                    </button>
                  )}
                  <button onClick={() => remove(it.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kaldır">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
