import type { ReactNode } from "react";
import { POLICY_UPDATED } from "../lib/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">{title}</h1>
      <div className="space-y-3">{children}</div>
      <p className="text-xs text-slate-500 mt-8">Son güncelleme: {POLICY_UPDATED}</p>
    </article>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold mt-6 mb-1 text-slate-900 dark:text-slate-100">{children}</h2>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
