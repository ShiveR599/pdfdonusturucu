import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PdfToImage } from "../components/PdfToImage";
import { ImageToPdf } from "../components/ImageToPdf";
import { PdfSplit } from "../components/PdfSplit";
import { PdfPagesEdit } from "../components/PdfPagesEdit";
import { IbanCheck } from "../components/IbanCheck";
import { OtherTools } from "../components/ToolPage";
import { seo, SITE_NAME } from "../lib/site";
import type { AnyToolPath } from "../lib/tools";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `${SITE_NAME} – Ücretsiz PDF ve Görsel Araçları`,
      description:
        "PDF'i JPG'ye çevirin, görselleri PDF yapın, PDF birleştirin, bölün, sıkıştırın, sayfaları düzenleyin ve IBAN doğrulayın. Ücretsiz; dosyalar tarayıcınızda işlenir, sunucuya yüklenmez.",
      path: "/",
    }),
  component: Index,
});

// Her sekmenin ayrıntılı açıklaması kendi sayfasında durur; ana sayfada aynı metin tekrarlanmaz
// (Google'ın aynı içeriği iki adreste görmesini önlemek için).
const TABS: { id: string; label: string; to: AnyToolPath }[] = [
  { id: "pdf2img", label: "PDF'ten Görsele", to: "/pdf-jpg" },
  { id: "img2pdf", label: "Görüntüden PDF'e", to: "/jpg-pdf" },
  { id: "split", label: "PDF Böl", to: "/pdf-bol" },
  { id: "edit", label: "Sayfa Düzenle", to: "/pdf-sayfa-duzenle" },
  { id: "iban", label: "IBAN Doğrulama", to: "/iban-dogrulama" },
];

const WHY = [
  {
    title: "Dosyalarınız cihazınızdan çıkmaz",
    text: "Araçlar tarayıcınızın içinde çalışır. PDF'leriniz, fotoğraflarınız ve IBAN'larınız hiçbir sunucuya yüklenmez, kaydedilmez.",
  },
  {
    title: "Kayıt, üyelik, sınır yok",
    text: "E-posta istemeyiz, hesap açtırmayız, günlük işlem sınırı koymayız. Siteyi açıp hemen kullanabilirsiniz.",
  },
  {
    title: "Telefonda da çalışır",
    text: "Uygulama indirmeden, güncel bir tarayıcıyla bilgisayarda, tablette ve telefonda aynı şekilde çalışır.",
  },
];

type TabId = string;

function Index() {
  const [tab, setTab] = useState<TabId>("pdf2img");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Dönüştürücü — Ücretsiz ve Tarayıcıda</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          PDF ve görsellerinizi dönüştürün, bölün, düzenleyin; IBAN doğrulayın. Dosyalarınız sunucuya yüklenmez; tüm işlem cihazınızda yapılır.
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
      {tab === "iban" && <IbanCheck />}

      <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">
        Ayrıntılı kullanım ve ipuçları:{" "}
        <Link to={current.to} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          {current.label} sayfası →
        </Link>
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">Neden {SITE_NAME}?</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {WHY.map((w) => (
            <div key={w.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm">{w.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <OtherTools />
    </div>
  );
}
