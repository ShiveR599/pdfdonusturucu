import { useRef, useState } from "react";
import { Upload, Loader2, Download, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib } from "../lib/pdfjs";
import { downloadBlob } from "../lib/format";

type Thumb = { num: number; preview: string; selected: boolean };

function parseRanges(input: string, total: number): number[][] {
  const groups: number[][] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((n) => parseInt(n, 10));
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > total) throw new Error("invalid");
      const arr: number[] = [];
      for (let i = a; i <= b; i++) arr.push(i - 1);
      groups.push(arr);
    } else {
      const n = parseInt(part, 10);
      if (!Number.isInteger(n) || n < 1 || n > total) throw new Error("invalid");
      groups.push([n - 1]);
    }
  }
  return groups;
}

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [mode, setMode] = useState<"range" | "each">("range");
  const [rangeInput, setRangeInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
    setError("");
    setThumbs([]);
    const buf = await f.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const list: Thumb[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const vp = p.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await p.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
      list.push({ num: i, preview: canvas.toDataURL("image/jpeg", 0.7), selected: true });
    }
    setThumbs(list);
  }

  function reset() {
    setFile(null);
    setThumbs([]);
    setRangeInput("");
    setError("");
  }
  function selectAll() {
    setThumbs((p) => p.map((x) => ({ ...x, selected: true })));
  }
  function clearSel() {
    setThumbs((p) => p.map((x) => ({ ...x, selected: false })));
  }
  function toggle(num: number) {
    setThumbs((p) => p.map((x) => (x.num === num ? { ...x, selected: !x.selected } : x)));
  }

  async function buildPdf(src: PDFDocument, indices: number[]): Promise<Blob> {
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    return new Blob([bytes as BlobPart], { type: "application/pdf" });
  }

  async function run() {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const base = file.name.replace(/\.pdf$/i, "");
      const total = src.getPageCount();

      let groups: number[][] = [];
      let labels: string[] = [];

      if (mode === "range") {
        if (!rangeInput.trim()) {
          setError("Lütfen bir sayfa aralığı girin (örn: 1-3, 5, 8-10).");
          setBusy(false);
          return;
        }
        try {
          groups = parseRanges(rangeInput, total);
        } catch {
          setError(`Geçersiz aralık. 1-${total} arasında olmalı.`);
          setBusy(false);
          return;
        }
        labels = groups.map((g) => (g.length === 1 ? `sayfa_${g[0] + 1}` : `sayfa_${g[0] + 1}-${g[g.length - 1] + 1}`));
      } else {
        const sel = thumbs.filter((t) => t.selected).map((t) => t.num - 1);
        const pages = sel.length ? sel : Array.from({ length: total }, (_, i) => i);
        groups = pages.map((i) => [i]);
        labels = pages.map((i) => `sayfa_${i + 1}`);
      }

      if (groups.length === 1) {
        const blob = await buildPdf(src, groups[0]);
        downloadBlob(blob, `${base}_${labels[0]}.pdf`);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < groups.length; i++) {
          const blob = await buildPdf(src, groups[i]);
          zip.file(`${base}_${labels[i]}.pdf`, blob);
        }
        const out = await zip.generateAsync({ type: "blob" });
        downloadBlob(out, `${base}_bolunmus.zip`);
      }
    } catch (e) {
      setError("PDF bölme işlemi başarısız oldu.");
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
        <p className="font-semibold">Bölmek için bir PDF yükleyin</p>
        <p className="text-sm text-slate-500 mt-1">Tek dosya · İşlem tarayıcınızda yapılır</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" hidden onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {file && thumbs.length > 0 && (
        <>
          <div className="mt-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium truncate flex-1">{file.name}</span>
              <span className="text-slate-500">{thumbs.length} sayfa</span>
              <button onClick={reset} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded inline-flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Temizle
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={mode === "range"} onChange={() => setMode("range")} className="accent-primary-600" />
                <span className="text-sm font-medium">Sayfa aralığı ile böl</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={mode === "each"} onChange={() => setMode("each")} className="accent-primary-600" />
                <span className="text-sm font-medium">Her sayfayı ayrı PDF yap</span>
              </label>
            </div>

            {mode === "range" && (
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="örn: 1-3, 5, 8-10"
                  className="flex-1 min-w-[200px] px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
                />
              </div>
            )}

            {mode === "each" && (
              <div className="flex gap-2">
                <button onClick={selectAll} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                  Tümünü Seç
                </button>
                <button onClick={clearSel} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                  Seçimi Temizle
                </button>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={run}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Böl ve İndir
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {thumbs.map((t) => (
              <div
                key={t.num}
                className={`relative bg-white dark:bg-slate-900 border-2 rounded-xl overflow-hidden ${
                  mode === "each" && t.selected ? "border-primary-500" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800">
                  <img src={t.preview} alt={`Sayfa ${t.num}`} className="w-full h-full object-contain" />
                </div>
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[11px] rounded bg-slate-900/80 text-white">{t.num}</span>
                {mode === "each" && (
                  <input
                    type="checkbox"
                    checked={t.selected}
                    onChange={() => toggle(t.num)}
                    className="absolute top-1.5 right-1.5 w-4 h-4 accent-primary-600 cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}