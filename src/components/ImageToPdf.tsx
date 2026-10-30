import { useEffect, useRef, useState } from "react";
import { Trash2, RotateCw, GripVertical, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { downloadBlob, imageMime, loadImage, canvasToBlob, fitWithin, moveItem } from "../lib/format";
import { withTimeout } from "../lib/pdfjs";
import { DropZone, ErrorBox, MoveButtons } from "./ToolUi";

type Img = { id: string; file: File; url: string; rotation: number };

// A4 (punto). Yatay görseller yatay A4 sayfaya yerleştirilir.
const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 14.17; // ~5 mm
// Uzun kenar sınırı: A4 için ~340 DPI baskı kalitesi; telefonlarda tuval sınırını da aşmaz.
const MAX_SIDE = 4000;

/** Kullanıcıya olduğu gibi gösterilecek hata. */
class UserError extends Error {}

export function ImageToPdf() {
  const [imgs, setImgs] = useState<Img[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const dragId = useRef<string | null>(null);
  const imgsRef = useRef<Img[]>([]);
  imgsRef.current = imgs;

  useEffect(() => () => imgsRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  function add(files: File[]) {
    setError("");
    const accepted = files.filter((f) => imageMime(f));
    const skipped = files.length - accepted.length;
    const next = accepted.map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file), rotation: 0 }));
    setImgs((p) => [...p, ...next]);
    if (skipped) setError(`${skipped} dosya atlandı. Yalnızca JPEG, PNG ve WebP görseller desteklenir (HEIC desteklenmez).`);
  }

  function remove(id: string) {
    const it = imgs.find((x) => x.id === id);
    if (it) URL.revokeObjectURL(it.url);
    setImgs((p) => p.filter((x) => x.id !== id));
  }
  function rotate(id: string) {
    setImgs((p) => p.map((x) => (x.id === id ? { ...x, rotation: (x.rotation + 90) % 360 } : x)));
  }
  function clear() {
    imgs.forEach((i) => URL.revokeObjectURL(i.url));
    setImgs([]);
    setError("");
  }
  const move = (from: number, to: number) => setImgs((p) => moveItem(p, from, to));

  function onDragOverItem(e: React.DragEvent, id: string) {
    if (!dragId.current) return; // Dışarıdan dosya sürükleniyorsa sıralama yapma.
    e.preventDefault();
    if (dragId.current === id) return;
    setImgs((p) => moveItem(p, p.findIndex((x) => x.id === dragId.current), p.findIndex((x) => x.id === id)));
  }

  async function makePdf() {
    if (!imgs.length || processing) return;
    setProcessing(true);
    setError("");
    try {
      const pdfDoc = await PDFDocument.create();
      for (const it of imgs) {
        let img: HTMLImageElement;
        try {
          img = await loadImage(it.url);
        } catch {
          throw new UserError(`"${it.file.name}" açılamadı. Dosya bozuk olabilir; listeden kaldırıp tekrar deneyin.`);
        }
        const { w, h } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_SIDE);
        const turned = it.rotation === 90 || it.rotation === 270;
        const canvas = document.createElement("canvas");
        canvas.width = turned ? h : w;
        canvas.height = turned ? w : h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new UserError("Cihazınızın belleği yetmedi. Daha az görselle deneyin.");
        // Saydam PNG'ler siyah görünmesin diye arka planı beyaz yap.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((it.rotation * Math.PI) / 180);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        let jpeg: Blob;
        try {
          jpeg = await canvasToBlob(canvas, "image/jpeg", 0.92);
        } catch {
          throw new UserError("Cihazınızın belleği yetmedi. Daha az veya daha küçük görsellerle deneyin.");
        }
        const embedded = await pdfDoc.embedJpg(await jpeg.arrayBuffer());
        const cw = canvas.width;
        const ch = canvas.height;
        canvas.width = 0;
        canvas.height = 0;

        const landscape = cw > ch;
        const pageW = landscape ? A4_H : A4_W;
        const pageH = landscape ? A4_W : A4_H;
        const ratio = Math.min((pageW - MARGIN * 2) / cw, (pageH - MARGIN * 2) / ch);
        const fw = cw * ratio;
        const fh = ch * ratio;
        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embedded, { x: (pageW - fw) / 2, y: (pageH - fh) / 2, width: fw, height: fh });
      }
      const bytes = await withTimeout(pdfDoc.save());
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const base = imgs[0].file.name.replace(/\.[^.]+$/, "");
      downloadBlob(blob, imgs.length > 1 ? `${base}_ve_digerleri.pdf` : `${base}.pdf`);
    } catch (e) {
      setError(
        e instanceof UserError
          ? e.message
          : e instanceof Error && e.message === "TIMEOUT"
            ? "İşlem zaman aşımına uğradı. Daha az görselle deneyin."
            : "PDF oluşturulurken bir hata oluştu. Görsellerin bozuk olmadığından emin olup tekrar deneyin.",
      );
    } finally {
      setProcessing(false);
    }
  }

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

      {imgs.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={clear}
              disabled={processing}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              Temizle
            </button>
            <span className="text-sm text-slate-500">{imgs.length} görsel · sıralamak için sürükleyin veya oklara dokunun</span>
            <button
              onClick={makePdf}
              disabled={processing}
              className="ml-auto px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-40"
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              PDF Oluştur ve İndir
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {imgs.map((it, idx) => (
              <div
                key={it.id}
                draggable
                onDragStart={() => (dragId.current = it.id)}
                onDragEnd={() => (dragId.current = null)}
                onDragOver={(e) => onDragOverItem(e, it.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={it.url}
                    alt={`Görsel ${idx + 1}: ${it.file.name}`}
                    className="max-w-[80%] max-h-[80%] object-contain transition-transform"
                    style={{ transform: `rotate(${it.rotation}deg)` }}
                  />
                </div>
                <GripVertical className="hidden sm:block absolute top-2 left-2 w-5 h-5 text-white drop-shadow cursor-grab" />
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center gap-1">
                  <span className="text-xs text-white truncate flex-1">{it.file.name}</span>
                  <MoveButtons index={idx} count={imgs.length} onMove={move} />
                  <button onClick={() => rotate(it.id)} className="p-1 rounded bg-white/20 hover:bg-white/30" aria-label="Döndür">
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => remove(it.id)} className="p-1 rounded bg-red-500/80 hover:bg-red-600" aria-label="Kaldır">
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
