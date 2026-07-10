import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PdfToImage } from "../components/PdfToImage";
import { ImageToPdf } from "../components/ImageToPdf";
import { PdfSplit } from "../components/PdfSplit";
import { PdfPagesEdit } from "../components/PdfPagesEdit";
import { ToolDescription } from "../components/ToolDescription";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PDF Dönüştürücü – Ücretsiz PDF & Görsel İşleme Aracı" },
      { name: "description", content: "PDF dönüştür, birleştir, böl, sıkıştır ve sayfa düzenle. Görsel sıkıştır. %100 ücretsiz, sınırsız, tarayıcı tabanlı — sunucusuz." },
      { property: "og:title", content: "PDF Dönüştürücü" },
      { property: "og:description", content: "PDF dönüştür, birleştir, böl ve sıkıştır. Görsel işleme araçları. Ücretsiz, sınırsız, tarayıcı tabanlı." },
      { property: "og:url", content: "https://pdfdonusturucu.netlify.app/" },
      { property: "og:image", content: "https://pdfdonusturucu.netlify.app/og-image.svg" },
      { name: "twitter:image", content: "https://pdfdonusturucu.netlify.app/og-image.svg" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.netlify.app/" }],
  }),
  component: Index,
});

const TABS = [
  { id: "pdf2img", label: "PDF'ten Görsele" },
  { id: "img2pdf", label: "Görüntüden PDF'e" },
  { id: "split", label: "PDF Böl" },
  { id: "edit", label: "Sayfa Düzenle" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Index() {
  const [tab, setTab] = useState<TabId>("pdf2img");
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Dönüştürücü — Ücretsiz ve Güvenli</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          PDF ile görselleri tarayıcınızda dönüştürün, bölün ve sayfalarını düzenleyin — ücretsiz, sınırsız, güvenli.
        </p>
      </div>
      <div className="inline-flex flex-wrap p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
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

      {(tab === "pdf2img" || tab === "img2pdf") && (
        <ToolDescription
          title="PDF Dönüştürücü Nasıl Çalışır?"
          items={[
            "PDF Dönüştürücü aracı, yüklediğiniz PDF dosyasının her sayfasını tarayıcınızda pdfjs-dist kütüphanesi ile işler ve JPEG, PNG veya WebP formatında görsel olarak dışa aktarır.",
            "Dosyalarınız hiçbir sunucuya gönderilmez; tüm işlem cihazınızın belleğinde gerçekleşir.",
            "Birden fazla PDF aynı anda yüklenebilir, dosya sayısı sınırı yoktur.",
            "Tek PDF yüklendiğinde sayfa aralığı belirleyebilirsiniz (örneğin: 1-5, 8, 11-13).",
            "Birden fazla PDF yüklendiğinde tüm sayfalar listelenir ve bireysel sayfa seçimi yapabilirsiniz.",
            "4 farklı kalite seviyesi mevcuttur: Standart (108 DPI) günlük kullanım için, HD (216 DPI) ise baskı kalitesi gerektiren durumlar için uygundur.",
            "Seçilen sayfalar tek ZIP dosyası olarak ya da ayrı ayrı indirilebilir.",
            "Görüntüden PDF'e sekmesinde JPEG, PNG ve WebP görsellerinizi sürükleyerek sıralayabilir, döndürebilir ve tek bir PDF dosyasında birleştirebilirsiniz.",
          ]}
        />
      )}
      {tab === "split" && (
        <ToolDescription
          title="PDF Bölme Nasıl Çalışır?"
          items={[
            "PDF Böl aracı, tek bir PDF dosyasını belirttiğiniz sayfa aralıklarına göre birden fazla ayrı PDF'e böler.",
            "Tüm işlem tarayıcınızda gerçekleşir; dosyanız sunucuya gönderilmez.",
            "İki farklı bölme modu mevcuttur: Sayfa aralığı ile bölerken 1-3, 5, 8-10 formatında istediğiniz aralıkları belirtirsiniz ve her aralık ayrı bir PDF dosyası olarak oluşturulur.",
            "'Her sayfayı ayrı böl' modunda ise tüm sayfalar tek tek PDF dosyalarına dönüştürülür ve ZIP olarak indirilir.",
            "Büyük belgelerin belirli bölümlerini ayıklamak, gereksiz sayfaları çıkarmak veya bir raporu bölümlere ayırmak için idealdir.",
          ]}
        />
      )}
      {tab === "edit" && (
        <ToolDescription
          title="PDF Sayfa Düzenleme Nasıl Çalışır?"
          items={[
            "Sayfa Düzenle aracı ile PDF dosyanızdaki sayfaları yeniden sıralayabilir, döndürebilir veya istemediğiniz sayfaları silebilirsiniz.",
            "Tüm işlem tarayıcınızda gerçekleşir; dosyanız sunucuya gönderilmez.",
            "PDF'i yükledikten sonra sayfaları sürükleyerek istediğiniz sıraya getirebilirsiniz.",
            "Her sayfanın sağ üst köşesindeki döndürme butonlarıyla sayfayı 90° saat yönünde veya tersine döndürebilirsiniz.",
            "Gereksiz sayfaları çöp kutusu ikonuyla kaldırabilirsiniz.",
            "Tüm düzenlemelerinizi yaptıktan sonra 'Değişiklikleri Uygula ve İndir' butonuyla güncellenmiş PDF'i indirin.",
          ]}
        />
      )}
    </div>
  );
}
