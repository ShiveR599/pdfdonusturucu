import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PdfToImage } from "../components/PdfToImage";
import { ImageToPdf } from "../components/ImageToPdf";
import { PdfSplit } from "../components/PdfSplit";
import { PdfPagesEdit } from "../components/PdfPagesEdit";
import { ToolDescription } from "../components/ToolDescription";
import { OtherTools } from "../components/ToolPage";
import { TEXT_PDF_TO_IMAGE, TEXT_IMAGE_TO_PDF, TEXT_SPLIT, TEXT_EDIT } from "../lib/toolTexts";
import { seo, SITE_NAME } from "../lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `${SITE_NAME} – Ücretsiz PDF ve Görsel Araçları`,
      description:
        "PDF'i JPG'ye çevirin, görselleri PDF yapın, PDF birleştirin, bölün, sıkıştırın ve sayfaları düzenleyin. Ücretsiz; dosyalar tarayıcınızda işlenir, sunucuya yüklenmez.",
      path: "/",
    }),
  component: Index,
});

const TABS = [
  { id: "pdf2img", label: "PDF'ten Görsele", text: TEXT_PDF_TO_IMAGE },
  { id: "img2pdf", label: "Görüntüden PDF'e", text: TEXT_IMAGE_TO_PDF },
  { id: "split", label: "PDF Böl", text: TEXT_SPLIT },
  { id: "edit", label: "Sayfa Düzenle", text: TEXT_EDIT },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Index() {
  const [tab, setTab] = useState<TabId>("pdf2img");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Dönüştürücü — Ücretsiz ve Tarayıcıda</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          PDF ve görsellerinizi dönüştürün, bölün ve düzenleyin. Dosyalarınız sunucuya yüklenmez; tüm işlem cihazınızda yapılır.
        </p>
      </div>
      <div role="tablist" aria-label="Araç seçimi" className="inline-flex flex-wrap p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              tab === t.id ? "bg-white dark:bg-slate-800 shadow text-primary-700 dark:text-primary-300" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "pdf2img" && <PdfToImage />}
      {tab === "img2pdf" && <ImageToPdf />}
      {tab === "split" && <PdfSplit />}
      {tab === "edit" && <PdfPagesEdit />}

      <ToolDescription title={current.text.title} items={current.text.items} />
      <OtherTools />
    </div>
  );
}
