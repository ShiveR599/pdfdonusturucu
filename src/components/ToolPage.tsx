import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ToolDescription } from "./ToolDescription";
import { ALL_TOOLS } from "../lib/tools";

/** Araç sayfalarının ortak iskeleti: başlık, araç, açıklama ve diğer araçlar. */
export function ToolPage({
  title,
  intro,
  text,
  current,
  children,
}: {
  title: string;
  intro: string;
  text: { title: string; items: string[] };
  current?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{intro}</p>
      </div>
      {children}
      <ToolDescription title={text.title} items={text.items} />
      <OtherTools current={current} />
    </div>
  );
}

export function OtherTools({ current }: { current?: string }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">Diğer Araçlar</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_TOOLS.filter((t) => t.to !== current).map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-primary-400 transition"
          >
            <span className="block font-semibold text-sm">{t.label}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
