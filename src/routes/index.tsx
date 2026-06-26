import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PdfToImage } from "../components/PdfToImage";
import { ImageToPdf } from "../components/ImageToPdf";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PDF Dönüştürücü — PDF ↔ Görsel Çevirme | Ücretsiz" },
      { name: "description", content: "PDF'i JPEG, PNG veya WebP'ye dönüştürün; görselleri PDF'e ekleyin. Tamamen tarayıcıda, ücretsiz ve sınırsız." },
      { property: "og:title", content: "PDF Dönüştürücü" },
      { property: "og:description", content: "PDF ↔ Görsel dönüştürme. Tarayıcıda, ücretsiz, sınırsız." },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<"pdf2img" | "img2pdf">("pdf2img");
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Dönüştürücü</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">PDF ile görselleri tarayıcınızda dönüştürün — ücretsiz, sınırsız, güvenli.</p>
      </div>
      <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-5">
        <button
          onClick={() => setTab("pdf2img")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${tab === "pdf2img" ? "bg-white dark:bg-slate-800 shadow text-primary-700 dark:text-primary-300" : "text-slate-600 dark:text-slate-400"}`}
        >
          PDF → Görsel
        </button>
        <button
          onClick={() => setTab("img2pdf")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${tab === "img2pdf" ? "bg-white dark:bg-slate-800 shadow text-primary-700 dark:text-primary-300" : "text-slate-600 dark:text-slate-400"}`}
        >
          Görsel → PDF
        </button>
      </div>
      {tab === "pdf2img" ? <PdfToImage /> : <ImageToPdf />}
      <InArticleAd />
    </div>
  );
}
