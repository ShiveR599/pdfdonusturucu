import { useRef, useState, type ReactNode } from "react";
import { Upload, AlertCircle, Info, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

/** Tüm araçlarda ortak dosya bırakma/seçme alanı. */
export function DropZone({
  accept,
  multiple = false,
  onFiles,
  title,
  subtitle,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title: string;
  subtitle: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-300 dark:border-slate-700 hover:border-primary-400"
      }`}
    >
      <Upload className="w-10 h-10 mx-auto text-primary-500 mb-3" />
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          // Aynı dosya tekrar seçilebilsin diye seçiciyi sıfırla.
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

export function ErrorBox({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div role="alert" className="mt-4 flex items-start gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-xl p-3">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary-600 dark:text-primary-400" />
      <span>{children}</span>
    </div>
  );
}

/** Dokunmatik ekranlarda da sıralama yapılabilmesi için önceki/sonraki düğmeleri. */
export function MoveButtons({
  index,
  count,
  onMove,
  vertical = false,
  dark = true,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  vertical?: boolean;
  dark?: boolean;
}) {
  const Prev = vertical ? ChevronUp : ChevronLeft;
  const Next = vertical ? ChevronDown : ChevronRight;
  const cls = dark
    ? "p-1 rounded bg-white/20 hover:bg-white/30 text-white disabled:opacity-30"
    : "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30";
  return (
    <>
      <button
        type="button"
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        className={cls}
        aria-label={vertical ? "Yukarı taşı" : "Öne taşı"}
      >
        <Prev className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, index + 1)}
        disabled={index === count - 1}
        className={cls}
        aria-label={vertical ? "Aşağı taşı" : "Arkaya taşı"}
      >
        <Next className="w-4 h-4" />
      </button>
    </>
  );
}

export function Progress({ done, total, label = "sayfa" }: { done: number; total: number; label?: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="mt-4 max-w-md mx-auto">
      <div className="text-sm text-center text-slate-600 dark:text-slate-400 mb-1">
        İşleniyor... {done}/{total} {label}
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-primary-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
