import type { ReactNode } from "react";

export function ToolDescription({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}