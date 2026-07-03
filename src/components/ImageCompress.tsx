import { useRef, useState } from "react";
import { Upload, Loader2, Download, X, Trash2, Info } from "lucide-react";
import JSZip from "jszip";
import { downloadBlob, formatBytes } from "../lib/format";

type Item = {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  compressed?: { blob: Blob; size: number; name: string };
  busy?: boolean;
};

const LEVELS: Record<string, { maxW: number; q: number }> = {
  "Yüksek Sıkıştırma": { maxW: 1200, q: 0.4 },
  "Orta Sıkıştırma": { maxW: 1920, q: 0.65 },
  "Düşük Sıkıştırma / Yüksek Kalite": { maxW: 2400, q: 0.88 },
};

export function ImageCompress() {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState("Orta Sıkıştırma");
  const [dragOver, setDragOver] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = url;
    });
  }

  async function add(files: FileList | File[]) {
    const next: Item[] = [];
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      next.push({
        id: crypto.randomUUID(),
        file,
        url,
        width: img.width,
        height: img.height,
        originalSize: file.size,
      });
    }
    setItems((p) => [...p, ...next]);
  }

  async function compressOne(it: Item): Promise<{ blob: Blob; name: string }> {
    const { maxW, q } = LEVELS[level];
    const img = await loadImage(it.url);
    const ratio = img.width > maxW ? maxW / img.width : 1;
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const mime = it.file.type;
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    const blob =
      mime === "image/png"
        ? await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"))
        : await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), mime, q));
    const base = it.file.name.replace(/\.[^.]+$/, "");
    return { blob, name: `${base}_sikistirilmis.${ext}` };
  }

  async function runOne(id: string) {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, busy: true } : x)));
    const it = items.find((x) => x.id === id)!;
    const { blob, name } = await compressOne(it);
    setItems((p) => p.map((x) => (x.id === id ? { ...x, busy: false, compressed: { blob, size: blob.size, name } } : x)));
  }

  async function runAll() {
    for (const it of items) {
      if (!it.compressed) {
        const { blob, name } = await compressOne(it);
        setItems((p) => p.map((x) => (x.id === it.id ? { ...x, compressed: { blob, size: blob.size, name } } : x)));
      }
    }
  }

  async function zipAll() {
    setBulkBusy(true);
    const zip = new JSZip();
    for (const it of items) {
      let c = it.compressed;
      if (!c) {
        const r = await compressOne(it);
        c = { blob: r.blob, size: r.blob.size, name: r.name };
      }
      zip.file(c.name, c.blob);
    }
    const out = await zip.generateAsync({ type: "blob" });
    downloadBlob(out, "sikistirilmis-gorseller.zip");
    setBulkBusy(false);
  }

  function remove(id: string) {
    setItems((p) => p.filter((x) => x.id !== id));
  }
  function clear() {
    setItems([]);
  }

  const hasPng = items.some((i) => i.file.type === "image/png");

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
        <p className="font-semibold">Görselleri buraya sürükleyin veya seçin</p>
        <p className="text-sm text-slate-500 mt-1">JPEG · PNG · WebP · Sınır yok · Sunucuya gönderilmez</p>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files && add(e.target.files)} />
      </div>

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border-0">
              {Object.keys(LEVELS).map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <button onClick={runAll} className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold">
              Tümünü Sıkıştır
            </button>
            <button
              onClick={zipAll}
              disabled={bulkBusy}
              className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-1 disabled:opacity-40"
            >
              {bulkBusy && <Loader2 className="w-4 h-4 animate-spin" />} Tümünü ZIP İndir
            </button>
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
          </div>

          {hasPng && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
              <Info className="w-4 h-4" /> PNG için yalnızca boyut küçültme uygulanır
            </div>
          )}

          <div className="mt-4 space-y-2">
            {items.map((it) => {
              const savings = it.compressed ? Math.max(0, Math.round((1 - it.compressed.size / it.originalSize) * 100)) : 0;
              return (
                <div key={it.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-wrap">
                  <img src={it.url} alt="" className="w-16 h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.file.name}</p>
                    <p className="text-xs text-slate-500">
                      {it.width}×{it.height} · {formatBytes(it.originalSize)}
                      {it.compressed && (
                        <>
                          {" → "}
                          <span className="text-accent-600 font-semibold">{formatBytes(it.compressed.size)} (%{savings} tasarruf)</span>
                        </>
                      )}
                    </p>
                  </div>
                  {it.compressed ? (
                    <button
                      onClick={() => downloadBlob(it.compressed!.blob, it.compressed!.name)}
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
                      {it.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Sıkıştır
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
