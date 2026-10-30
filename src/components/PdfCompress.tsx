import { useState } from "react";
import { FileText, Loader2, Download, X, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { pdfjsLib, withTimeout, pdfErrorMessage } from "../lib/pdfjs";
import { downloadBlob, formatBytes, isPdf, canvasToBlob } from "../lib/format";
import { DropZone, ErrorBox, InfoBox } from "./ToolUi";

type Result = { blob: Blob; size: number; kept: boolean };

type Item = {
  id: string;
  file: File;
  pages: number;
  originalSize: number;
  result?: Result;
  busy?: boolean;
  error?: string;
};

// scale: 1 = 72 DPI. Sayfa ölçüsü her seviyede orijinal kalır; yalnızca çözünürlük değişir.
const LEVELS: Record<string, { scale: number; quality: number }> = {
  "Yüksek Sıkıştırma": { scale: 1.25, quality: 0.5 },
  "Orta Sıkıştırma": { scale: 1.5, quality: 0.7 },
  "Düşük Sıkıştırma / Yüksek Kalite": { scale: 2.0, quality: 0.85 },
};

const outName = (f: File) => f.name.replace(/\.pdf$/i, "") + "_sikistirilmis.pdf";

async function compressFile(file: File, level: string): Promise<Result> {
  const { scale, quality } = LEVELS[level];
  const buf = await file.arrayBuffer();
  const srcDoc = await withTimeout(pdfjsLib.getDocument({ data: buf }).promise);
  try {
    const out = await PDFDocument.create();
    for (let i = 1; i <= srcDoc.numPages; i++) {
      const p = await srcDoc.getPage(i);
      const base = p.getViewport({ scale: 1 });
      const viewport = p.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("CANVAS");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await withTimeout(p.render({ canvasContext: ctx, viewport, canvas } as any).promise);
      const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
      canvas.width = 0;
      canvas.height = 0;
      const jpg = await out.embedJpg(await jpegBlob.arrayBuffer());
      // Sayfa boyutu orijinal ölçüde (punto) kalır; görüntü bu alana sığdırılır.
      const page = out.addPage([base.width, base.height]);
      page.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
      p.cleanup();
    }
    const bytes = await out.save();
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    // Sonuç orijinalden küçük değilse orijinali koru — kullanıcıya asla daha büyük dosya verme.
    if (blob.size >= file.size) return { blob: file, size: file.size, kept: true };
    return { blob, size: blob.size, kept: false };
  } finally {
    srcDoc.destroy();
  }
}

export function PdfCompress() {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState("Orta Sıkıştırma");
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const patch = (id: string, p: Partial<Item>) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  async function add(files: File[]) {
    setError("");
    setLoading(true);
    const next: Item[] = [];
    let failed = 0;
    let lastErr: unknown;
    for (const file of files) {
      if (!isPdf(file)) {
        failed++;
        continue;
      }
      try {
        const buf = await file.arrayBuffer();
        const doc = await withTimeout(pdfjsLib.getDocument({ data: buf }).promise);
        next.push({ id: crypto.randomUUID(), file, pages: doc.numPages, originalSize: file.size });
        doc.destroy();
      } catch (e) {
        failed++;
        lastErr = e;
      }
    }
    setItems((p) => [...p, ...next]);
    if (failed) setError(`${failed} dosya eklenemedi. ${lastErr ? pdfErrorMessage(lastErr) : "Yalnızca PDF dosyaları kabul edilir."}`);
    setLoading(false);
  }

  function changeLevel(v: string) {
    setLevel(v);
    // Seviye değişince eski sonuçlar geçersiz olur.
    setItems((p) => p.map((x) => ({ ...x, result: undefined, error: undefined })));
  }

  async function runOne(it: Item) {
    if (running) return;
    setRunning(true);
    patch(it.id, { busy: true, error: undefined });
    try {
      const result = await compressFile(it.file, level);
      patch(it.id, { busy: false, result });
    } catch (e) {
      patch(it.id, { busy: false, error: pdfErrorMessage(e) });
    } finally {
      setRunning(false);
    }
  }

  async function runAll() {
    if (running || !items.length) return;
    setRunning(true);
    setError("");
    const done: { item: Item; result: Result }[] = [];
    for (const it of items) {
      if (it.result) {
        done.push({ item: it, result: it.result });
        continue;
      }
      patch(it.id, { busy: true, error: undefined });
      try {
        const result = await compressFile(it.file, level);
        patch(it.id, { busy: false, result });
        done.push({ item: it, result });
      } catch (e) {
        patch(it.id, { busy: false, error: pdfErrorMessage(e) });
      }
    }
    try {
      const anyDone = done.length > 0;
      done.splice(0, done.length, ...done.filter((d) => !d.result.kept));
      if (!anyDone) {
        setError("Hiçbir dosya sıkıştırılamadı.");
      } else if (!done.length) {
        setError("Dosyalar bu seviyede küçültülemedi; orijinaller korundu. Daha yüksek bir sıkıştırma seviyesi deneyebilirsiniz.");
      } else if (done.length === 1) {
        downloadBlob(done[0].result.blob, outName(done[0].item.file));
      } else {
        const zip = new JSZip();
        const used = new Set<string>();
        for (const { item, result } of done) {
          let name = outName(item.file);
          let n = 2;
          while (used.has(name)) name = outName(item.file).replace(/\.pdf$/, `_${n++}.pdf`);
          used.add(name);
          zip.file(name, result.blob);
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), "sikistirilmis-pdfler.zip");
      }
    } catch (e) {
      setError(pdfErrorMessage(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <DropZone
        accept=".pdf,application/pdf"
        multiple
        onFiles={add}
        title="PDF'leri buraya sürükleyin veya seçin"
        subtitle="Birden fazla PDF · Tarayıcınızda işlenir · Sunucuya gönderilmez"
      />

      <InfoBox>
        Sıkıştırma, sayfaları görüntüye çevirerek yapılır. Bu nedenle sıkıştırılmış PDF'teki yazılar seçilemez, kopyalanamaz ve
        aranamaz; form alanları ve bağlantılar da kaldırılır. Taranmış belgeler ve fotoğraf ağırlıklı PDF'ler için idealdir. Sonuç
        orijinalden büyük olursa orijinal dosyanız korunur.
      </InfoBox>

      <ErrorBox>{error}</ErrorBox>

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Dosyalar okunuyor...
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <label htmlFor="pdf-level" className="text-sm font-medium">
              Sıkıştırma Seviyesi:
            </label>
            <select
              id="pdf-level"
              value={level}
              disabled={running}
              onChange={(e) => changeLevel(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
            >
              {Object.keys(LEVELS).map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <button
              onClick={() => setItems([])}
              disabled={running}
              className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
            <button
              onClick={runAll}
              disabled={running}
              className="ml-auto px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {items.length > 1 ? "Tümünü Sıkıştır ve ZIP İndir" : "Sıkıştır ve İndir"}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {items.map((it) => {
              const r = it.result;
              const savings = r && !r.kept ? Math.round((1 - r.size / it.originalSize) * 100) : 0;
              return (
                <div key={it.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-wrap">
                  <FileText className="w-8 h-8 text-primary-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.file.name}</p>
                    <p className="text-xs text-slate-500">
                      {it.pages} sayfa · {formatBytes(it.originalSize)}
                      {r && !r.kept && (
                        <>
                          {" → "}
                          <span className="text-accent-600 dark:text-accent-400 font-semibold">
                            {formatBytes(r.size)} (%{savings} küçüldü)
                          </span>
                        </>
                      )}
                    </p>
                    {r?.kept && (
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        Bu dosya zaten verimli; bu seviyede küçültülemedi. Orijinal dosya korundu — daha yüksek sıkıştırma seviyesini deneyebilirsiniz.
                      </p>
                    )}
                    {it.error && <p className="text-xs text-red-600 mt-1">{it.error}</p>}
                  </div>
                  {r && !r.kept ? (
                    <button
                      onClick={() => downloadBlob(r.blob, outName(it.file))}
                      className="px-3 py-1.5 text-sm rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-semibold inline-flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" /> İndir
                    </button>
                  ) : !r ? (
                    <button
                      onClick={() => runOne(it)}
                      disabled={running}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                    >
                      {it.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Sıkıştır
                    </button>
                  ) : null}
                  <button
                    onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                    disabled={running}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    aria-label="Kaldır"
                  >
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
