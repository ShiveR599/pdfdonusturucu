import { useEffect, useRef, useState } from "react";
import { Loader2, Download, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib, withTimeout, pdfErrorMessage, loadPdfLib } from "../lib/pdfjs";
import { downloadBlob, isPdf } from "../lib/format";
import { DropZone, ErrorBox, Progress } from "./ToolUi";

type Thumb = { num: number; preview: string; selected: boolean };

/** "1-3, 5, 8-10" → [[0,1,2],[4],[7,8,9]] (0 tabanlı). Geçersizse hata fırlatır. */
function parseRanges(input: string, total: number): number[][] {
  const groups: number[][] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) throw new Error("invalid");
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) throw new Error("invalid");
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < a || b > total) throw new Error("invalid");
    const arr: number[] = [];
    for (let i = a; i <= b; i++) arr.push(i - 1);
    groups.push(arr);
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
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
    setError("");
    setThumbs([]);
    setRangeInput("");
    setLoading(true);
    let doc: any;
    try {
      doc = await withTimeout(pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise);
      setProgress({ done: 0, total: doc.numPages });
      for (let i = 1; i <= doc.numPages; i++) {
        if (gen !== generation.current) return;
        const p = await doc.getPage(i);
        const vp = p.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("CANVAS");
        await withTimeout(p.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise);
        const preview = canvas.toDataURL("image/jpeg", 0.7);
        canvas.width = 0;
        canvas.height = 0;
        setThumbs((prev) => [...prev, { num: i, preview, selected: true }]);
        setProgress({ done: i, total: doc.numPages });
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
    } catch (e) {
      if (gen === generation.current) {
        setError(pdfErrorMessage(e));
        setFile(null);
        setThumbs([]);
      }
    } finally {
      doc?.destroy();
      if (gen === generation.current) {
        setLoading(false);
        setProgress(null);
      }
    }
  }

  function reset() {
    generation.current++;
    setFile(null);
    setThumbs([]);
    setRangeInput("");
    setError("");
    setLoading(false);
    setProgress(null);
  }
  const selectAll = () => setThumbs((p) => p.map((x) => ({ ...x, selected: true })));
  const clearSel = () => setThumbs((p) => p.map((x) => ({ ...x, selected: false })));
  const toggle = (num: number) => setThumbs((p) => p.map((x) => (x.num === num ? { ...x, selected: !x.selected } : x)));

  async function buildPdf(src: PDFDocument, indices: number[]): Promise<Blob> {
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    return new Blob([bytes as BlobPart], { type: "application/pdf" });
  }

  async function run() {
    if (!file || busy) return;
    setError("");
    const total = thumbs.length;
    let groups: number[][] = [];
    let labels: string[] = [];

    if (mode === "range") {
      try {
        groups = parseRanges(rangeInput, total);
      } catch {
        setError(`Geçersiz aralık. Sayfalar 1 ile ${total} arasında olmalı (örn: 1-3, 5, 8-10).`);
        return;
      }
      labels = groups.map((g) => (g.length === 1 ? `sayfa_${g[0] + 1}` : `sayfa_${g[0] + 1}-${g[g.length - 1] + 1}`));
    } else {
      const sel = thumbs.filter((t) => t.selected).map((t) => t.num - 1);
      if (!sel.length) {
        setError("Lütfen en az bir sayfa seçin.");
        return;
      }
      groups = sel.map((i) => [i]);
      labels = sel.map((i) => `sayfa_${i + 1}`);
    }

    setBusy(true);
    try {
      const src = await loadPdfLib(await file.arrayBuffer());
      const base = file.name.replace(/\.pdf$/i, "");
      if (groups.length === 1) {
        downloadBlob(await buildPdf(src, groups[0]), `${base}_${labels[0]}.pdf`);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < groups.length; i++) {
          zip.file(`${base}_${labels[i]}.pdf`, await buildPdf(src, groups[i]));
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${base}_bolunmus.zip`);
      }
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const ready = file && !loading && thumbs.length > 0;

  return (
    <div>
      <DropZone
        accept=".pdf,application/pdf"
        onFiles={loadFile}
        title="Bölmek için bir PDF seçin"
        subtitle="Tek dosya · Tarayıcınızda işlenir · Sunucuya gönderilmez"
      />

      <ErrorBox>{error}</ErrorBox>

      {loading && progress && <Progress done={progress.done} total={progress.total} />}

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
                <input type="radio" name="split-mode" checked={mode === "range"} onChange={() => setMode("range")} className="accent-primary-600" />
                <span className="text-sm font-medium">Sayfa aralığı ile böl</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="split-mode" checked={mode === "each"} onChange={() => setMode("each")} className="accent-primary-600" />
                <span className="text-sm font-medium">Seçili her sayfayı ayrı PDF yap</span>
              </label>
            </div>

            {mode === "range" && (
              <div className="space-y-1">
                <input
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && run()}
                  placeholder="örn: 1-3, 5, 8-10"
                  inputMode="numeric"
                  aria-label="Sayfa aralığı"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
                />
                <p className="text-xs text-slate-500">Virgülle ayrılan her aralık ayrı bir PDF olur.</p>
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

            <button
              onClick={run}
              disabled={busy || !ready}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Böl ve İndir
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {thumbs.map((t) => (
              <label
                key={t.num}
                className={`relative block bg-white dark:bg-slate-900 border-2 rounded-xl overflow-hidden ${
                  mode === "each" ? "cursor-pointer" : ""
                } ${mode === "each" && t.selected ? "border-primary-500" : "border-slate-200 dark:border-slate-800"}`}
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
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
