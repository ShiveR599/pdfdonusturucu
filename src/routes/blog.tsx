import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Calendar, Tag } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Rehberler — PDF Dönüştürücü" },
      { name: "description", content: "PDF ve görsel dosyalar hakkında pratik bilgiler, rehberler ve format karşılaştırmaları." },
      { property: "og:title", content: "Blog & Rehberler" },
      { property: "og:description", content: "PDF ve görsel dosyalar hakkında pratik bilgiler." },
      { property: "og:url", content: "https://pdfdonusturucu.netlify.app/blog" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.netlify.app/blog" }],
  }),
  component: Blog,
});

const POSTS = [
  {
    title: "PDF Dosyası Nasıl Küçültülür?",
    date: "Nisan 2026",
    tag: "Rehber",
    summary: "PDF dosyaları zamanla büyük boyutlara ulaşabilir. E-posta gönderimi veya depolama için dosya boyutunu küçültmek gerekebilir.",
    body: [
      "PDF dosyaları içerdikleri görsel, yazı tipi ve grafik sayısına bağlı olarak büyük boyutlara ulaşabilir. Özellikle taranmış belgeler veya yüksek çözünürlüklü görseller içeren PDF'ler e-posta ekleri için sorun yaratabilir.",
      "PDF Sıkıştır aracımızla dosyanızı tarayıcınıza yükleyin, sıkıştırma seviyesini seçin ve indirin. Sunucuya hiçbir veri gönderilmez.",
      "Sıkıştırma seviyeleri:\n— Yüksek Sıkıştırma: Maksimum boyut azaltma, e-posta ve mesajlaşma için ideal\n— Orta Sıkıştırma: Kalite ve boyut dengesi, çoğu kullanım için önerilir\n— Düşük Sıkıştırma / Yüksek Kalite: Minimal boyut azaltma, baskı ve arşiv için",
      "Sıkıştırma sonrasında orijinal boyut, yeni boyut ve tasarruf yüzdesi ekranda gösterilir. Birden fazla PDF yükleyip tümünü ZIP olarak da indirebilirsiniz.",
    ],
  },
  {
    title: "JPEG, PNG ve WebP Arasındaki Fark Nedir?",
    date: "Mayıs 2026",
    tag: "Bilgi",
    summary: "Hangi görsel formatı ne zaman kullanılmalı? Üç popüler formatın karşılaştırması.",
    body: [
      "Görsel formatı seçimi dosya boyutu ve kalite dengesi açısından önemlidir.",
      "JPEG: Fotoğraflar için idealdir. Kayıplı sıkıştırma kullanır; dosya boyutu küçüktür ancak her kaydetmede minimal kalite kaybı oluşur. Şeffaflık desteklenmez.",
      "PNG: Ekran görüntüleri ve şeffaf arka plan gerektiren görseller için uygundur. Kayıpsız sıkıştırma kullanır; kalite korunur ancak dosya boyutu daha büyüktür.",
      "WebP: Google tarafından geliştirilen modern bir formattır. Aynı kalitede JPEG'den yaklaşık %25-35 daha küçük dosya üretir. Tüm modern tarayıcılar tarafından desteklenir.",
      "PDF Dönüştürücü ile PDF sayfalarınızı bu üç formattan birinde dışa aktarabilir, görsellerinizi PDF'e ekleyebilir veya boyutlarını küçültebilirsiniz.",
    ],
  },
  {
    title: "Birden Fazla Görseli Tek PDF'e Nasıl Birleştiririm?",
    date: "Haziran 2026",
    tag: "Rehber",
    summary: "Fotoğrafları veya taranmış belgeleri tek bir PDF'de toplamak isteyenler için adım adım rehber.",
    body: [
      "Birden fazla görseli tek PDF'de birleştirmek; taranmış belgeleri düzenlemek veya fotoğrafları paylaşmak için sık kullanılan bir işlemdir.",
      "Adımlar:\n1. PDF Dönüştürücü menüsünden 'Görüntüden PDF'e' sekmesini açın.\n2. JPEG, PNG veya WebP görsellerinizi sürükleyip bırakın. Dosya sayısı sınırı yoktur.\n3. Görselleri sürükleyerek PDF'teki sayfa sıralamasını düzenleyin.\n4. Gerekirse her görseli 90° döndürün.\n5. 'PDF Oluştur ve İndir' butonuna tıklayın.",
      "Tüm işlem tarayıcınızda gerçekleşir. Görselleriniz hiçbir sunucuya yüklenmez.",
    ],
  },
];

function Blog() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Blog & Rehberler</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">PDF ve görsel dosyalar hakkında pratik bilgiler.</p>
      </div>
      <InArticleAd />
      <div className="space-y-4 max-w-3xl mx-auto">
        {POSTS.map((p, i) => {
          const isOpen = open === i;
          return (
            <article key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold">{p.title}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3 h-3" /> {p.date}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                    <Tag className="w-3 h-3" /> {p.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{p.summary}</p>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {isOpen ? "Kapat" : "Devamını Oku"}
                  <ChevronDown className={`w-4 h-4 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-200 dark:border-slate-800 pt-4 text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
                  {p.body.map((para, j) => (
                    <p key={j} className="whitespace-pre-line">{para}</p>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}