import { createFileRoute } from "@tanstack/react-router";
import { PdfCompress } from "../components/PdfCompress";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/pdf-sikistir")({
  head: () => ({
    meta: [
      { title: "PDF Sıkıştır — Ücretsiz Online PDF Küçültme" },
      { name: "description", content: "PDF dosyalarınızı tarayıcınızda ücretsiz ve sınırsız sıkıştırın." },
      { property: "og:title", content: "PDF Sıkıştır" },
      { property: "og:description", content: "PDF dosyalarınızı tarayıcınızda küçültün." },
    ],
  }),
  component: () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Sıkıştır</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Dosyalarınızı tarayıcınızda sıkıştırın — sunucusuz, sınırsız.</p>
      </div>
      <PdfCompress />
      <InArticleAd />
    </div>
  ),
});
