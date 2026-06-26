import { useRef, useState } from "react";
import { Upload, Trash2, RotateCw, GripVertical, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { downloadBlob } from "../lib/format";

type Img = { id: string; file: File; url: string; rotation: number };

export function ImageToPdf() {
  const [imgs, setImgs] = useState<Img[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragId = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function add(files: FileList | File[]) {
    const accepted = Array.from(files).filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    const next = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      rotation: 0,
    }));
    setImgs((p) => [...p, ...next]);
  }

  function remove(id: string) {
    setImgs((p) => p.filter((x) => x.id !== id));
  }
  function rotate(id: string) {
    setImgs((p) => p.map((x) => (x.id === id ? { ...x, rotation: (x.rotation + 90) % 360 } : x)));
  }
  function clear() {
    setImgs([]);
  }

  function onDragStart(id: string) {
    dragId.current = id;
  }
  function onDragOverItem(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === id) return;
    setImgs((p) => {
      const from = p.findIndex((x) => x.id === dragId.current);
      const to = p.findIndex((x) => x.id === id);
      if (from < 0 || to < 0) return p;
      const copy = [...p];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  async function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = url;
    });
  }

  async function makePdf() {
    if (!imgs.length) return;
    setProcessing(true);
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 5;
    for (let i = 0; i < imgs.length; i++) {
      const it = imgs[i];
      const img = await loadImage(it.url);
      const rot = it.rotation;
      let w = img.width;
      let h = img.height;
      // bake rotation onto a canvas
      const canvas = document.createElement("canvas");
      if (rot === 90 || rot === 270) {
        canvas.width = h;
        canvas.height = w;
      } else {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const cw = canvas.width;
      const ch = canvas.height;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = Math.min(maxW / cw, maxH / ch);
      const finalW = cw * ratio;
      const finalH = ch * ratio;
      const x = (pageW - finalW) / 2;
      const y = (pageH - finalH) / 2;
      if (i > 0) pdf.addPage();
      pdf.addImage(dataUrl, "JPEG", x, y, finalW, finalH);
    }
    const blob = pdf.output("blob");
    const base = imgs[0].file.name.replace(/\.[^.]+$/, "");
    downloadBlob(blob, `${base}_Birlestirilmis.pdf`);
    setProcessing(false);
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
        <p className="font-semibold">Görsel yüklemek için tıklayın veya sürükleyin</p>
        <p className="text-sm text-slate-500 mt-1">JPEG, PNG, WebP · Sınır yok</p>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files && add(e.target.files)} />
      </div>

      {imgs.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
              Temizle
            </button>
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
                onDragStart={() => onDragStart(it.id)}
                onDragOver={(e) => onDragOverItem(e, it.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-800">
                  <img src={it.url} alt={it.file.name} className="w-full h-full object-contain" style={{ transform: `rotate(${it.rotation}deg)` }} />
                </div>
                <GripVertical className="absolute top-2 left-2 w-5 h-5 text-white drop-shadow cursor-grab" />
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center gap-1">
                  <span className="text-xs text-white truncate flex-1">{it.file.name}</span>
                  <button onClick={() => rotate(it.id)} className="p-1 rounded bg-white/20 hover:bg-white/30" aria-label="Döndür">
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button onClick={() => remove(it.id)} className="p-1 rounded bg-red-500/80 hover:bg-red-600" aria-label="Kaldır">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
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
