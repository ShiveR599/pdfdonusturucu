import { useEffect, useRef, useState } from "react";
import { Loader2, Download, X, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { downloadBlob, formatBytes, imageMime, loadImage, canvasToBlob, canEncodeWebp } from "../lib/format";
import { DropZone, ErrorBox, InfoBox } from "./ToolUi";

type Result = { blob: Blob; size: number; name: string; kept: boolean; note?: string };

type Item = {
  id: string;
  file: File;
  mime: string;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  result?: Result;
  busy?: boolean;
  error?: string;
};

// maxSide: görselin uzun kenarı için üst sınır (piksel).
const LEVELS: Record<string, { maxSide: number; q: number }> = {
  "Yüksek Sıkıştırma": { maxSide: 1280, q: 0.5 },
  "Orta Sıkıştırma": { maxSide: 1920, q: 0.7 },
  "Düşük Sıkıştırma / Yüksek Kalite": { maxSide: 2560, q: 0.85 },
};

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function compressImage(it: Item, level: string): Promise<Result> {
  const { maxSide, q } = LEVELS[level];
  const img = await loadImage(it.url);
  const ratio = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("CANVAS");

  let outMime = it.mime;
  let note: string | undefined;
  if (outMime === "image/webp" && !canEncodeWebp()) {
    // Safari/iPhone WebP kaydedemez; JPEG'e çevirip kullanıcıya bildir.
    outMime = "image/jpeg";
    note = "Tarayıcınız WebP kaydedemediği için JPEG olarak kaydedildi (saydamlık beyaz olur).";
  }
  if (outMime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);
  const blob = outMime === "image/png" ? await canvasToBlob(canvas, "image/png") : await canvasToBlob(canvas, outMime, q);
  canvas.width = 0;
  canvas.height = 0;

  const base = it.file.name.replace(/\.[^.]+$/, "");
  if (blob.size >= it.originalSize) {
    return { blob: it.file, size: it.originalSize, name: it.file.name, kept: true };
  }
  return { blob, size: blob.size, name: `${base}_sikistirilmis.${EXT[outMime]}`, kept: false, note };
}

export function ImageCompress() {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState("Orta Sıkıştırma");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  // Sayfadan çıkınca önizleme adreslerini bellekten temizle.
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  const patch = (id: string, p: Partial<Item>) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  async function add(files: File[]) {
    setError("");
    const next: Item[] = [];
    let skipped = 0;
    for (const file of files) {
      const mime = imageMime(file);
      if (!mime) {
        skipped++;
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const img = await loadImage(url);
        next.push({
          id: crypto.randomUUID(),
          file,
          mime,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          originalSize: file.size,
        });
      } catch {
        URL.revokeObjectURL(url);
        skipped++;
      }
    }
    setItems((p) => [...p, ...next]);
    if (skipped) setError(`${skipped} dosya eklenemedi. Yalnızca bozuk olmayan JPEG, PNG ve WebP görseller desteklenir (HEIC desteklenmez).`);
  }

  function remove(id: string) {
    const it = items.find((x) => x.id === id);
    if (it) URL.revokeObjectURL(it.url);
    setItems((p) => p.filter((x) => x.id !== id));
  }
  function clear() {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setError("");
  }

  function changeLevel(v: string) {
    setLevel(v);
    setItems((p) => p.map((x) => ({ ...x, result: undefined, error: undefined })));
  }

  async function runOne(it: Item) {
    if (running) return;
    setRunning(true);
    patch(it.id, { busy: true, error: undefined });
    try {
      patch(it.id, { busy: false, result: await compressImage(it, level) });
    } catch {
      patch(it.id, { busy: false, error: "Bu görsel sıkıştırılamadı (dosya bozuk veya cihaz belleği yetersiz olabilir)." });
    } finally {
      setRunning(false);
    }
  }

  async function runAll() {
    if (running || !items.length) return;
    setRunning(true);
    setError("");
    const results: Result[] = [];
    for (const it of items) {
      if (it.result) {
        results.push(it.result);
        continue;
      }
      patch(it.id, { busy: true, error: undefined });
      try {
        const r = await compressImage(it, level);
        patch(it.id, { busy: false, result: r });
        results.push(r);
      } catch {
        patch(it.id, { busy: false, error: "Bu görsel sıkıştırılamadı." });
      }
    }
    try {
      const useful = results.filter((r) => !r.kept);
      if (!results.length) setError("Hiçbir görsel sıkıştırılamadı.");
      else if (!useful.length) setError("Görseller bu seviyede küçültülemedi; orijinaller korundu. Daha yüksek bir sıkıştırma seviyesi deneyebilirsiniz.");
      else if (useful.length === 1) downloadBlob(useful[0].blob, useful[0].name);
      else {
        const zip = new JSZip();
        const used = new Set<string>();
        for (const r of useful) {
          let name = r.name;
          let n = 2;
          while (used.has(name)) name = r.name.replace(/(\.[^.]+)$/, `_${n++}$1`);
          used.add(name);
          zip.file(name, r.blob);
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), "sikistirilmis-gorseller.zip");
      }
    } catch {
      setError("ZIP dosyası oluşturulamadı. Daha az görselle tekrar deneyin.");
    } finally {
      setRunning(false);
    }
  }

  const hasPng = items.some((i) => i.mime === "image/png");

  return (
    <div>
      <DropZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.jfif,.png,.webp"
        multiple
        onFiles={add}
        title="Görselleri buraya sürükleyin veya seçin"
        subtitle="JPEG · PNG · WebP · Tarayıcınızda işlenir · Sunucuya gönderilmez"
      />

      <ErrorBox>{error}</ErrorBox>

      {items.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <label htmlFor="img-level" className="text-sm font-medium">
              Sıkıştırma Seviyesi:
            </label>
            <select
              id="img-level"
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
              onClick={clear}
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

          {hasPng && (
            <InfoBox>
              PNG kayıpsız bir formattır; PNG görsellerde yalnızca çözünürlük küçültülür. Zaten küçük olan PNG'ler küçültülemeyebilir — bu
              durumda orijinal dosyanız korunur.
            </InfoBox>
          )}

          <div className="mt-4 space-y-2">
            {items.map((it) => {
              const r = it.result;
              const savings = r && !r.kept ? Math.round((1 - r.size / it.originalSize) * 100) : 0;
              return (
                <div key={it.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-wrap">
                  <img src={it.url} alt="" className="w-16 h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.file.name}</p>
                    <p className="text-xs text-slate-500">
                      {it.width}×{it.height} · {formatBytes(it.originalSize)}
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
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Bu görsel bu seviyede küçültülemedi; orijinal korundu.</p>
                    )}
                    {r?.note && <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{r.note}</p>}
                    {it.error && <p className="text-xs text-red-600 mt-1">{it.error}</p>}
                  </div>
                  {r && !r.kept ? (
                    <button
                      onClick={() => downloadBlob(r.blob, r.name)}
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
                      {it.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Sıkıştır
                    </button>
                  ) : null}
                  <button
                    onClick={() => remove(it.id)}
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
