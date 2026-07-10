import { createFileRoute } from "@tanstack/react-router";
import { Zap, CheckSquare, Image, Sparkles, GripVertical, Shield } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/ozelliklerimiz")({
  head: () => ({
    meta: [
      { title: "Özelliklerimiz — PDF Dönüştürücü" },
      { name: "description", content: "Sınırsız, ücretsiz, güvenli — PDF Dönüştürücü'nün öne çıkan özellikleri." },
      { property: "og:title", content: "Özelliklerimiz — PDF Dönüştürücü" },
      { property: "og:description", content: "Sınırsız, ücretsiz, güvenli — PDF Dönüştürücü'nün özellikleri." },
      { property: "og:url", content: "https://pdfdonusturucu.netlify.app/ozelliklerimiz" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.netlify.app/ozelliklerimiz" }],
  }),
  component: Features,
});

const CARDS = [
  { icon: Zap, title: "%100 Sınırsız ve Ücretsiz", text: "Dosya sayısı, boyut veya günlük kullanım sınırı olmadan sınırsız işlem yapın." },
  { icon: CheckSquare, title: "Gelişmiş Sayfa Seçimi", text: "PDF sayfalarını tek tek seçin, sayfa aralığı belirleyin veya toplu işaretleyin." },
  { icon: Image, title: "Çoklu Format Desteği", text: "JPEG, PNG ve WebP formatlarında çıktı alın veya bu formatları PDF'e dönüştürün." },
  { icon: Sparkles, title: "4 Kalite Seviyesi", text: "Standart'tan HD'ye (108–216 DPI) dört farklı çözünürlük seçeneği." },
  { icon: GripVertical, title: "Gelişmiş Düzenleme", text: "Görselleri sürükleyerek sıralayın, döndürün ve ZIP olarak toplu indirin." },
  { icon: Shield, title: "%100 Güvenli Sunucusuz Altyapı", text: "Dosyalarınız hiçbir sunucuya yüklenmez, tüm işlemler tarayıcınızda gizlilik içinde gerçekleşir." },
];

function Features() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Özelliklerimiz</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <div key={c.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center mb-4">
              <c.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold">{c.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{c.text}</p>
          </div>
        ))}
      </div>
      <InArticleAd />
    </div>
  );
}
