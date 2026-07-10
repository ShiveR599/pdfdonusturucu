import { createFileRoute } from "@tanstack/react-router";
import { Shield, Zap, Globe, FileImage, FileType, Minimize2, ImageDown, Combine, Scissors, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda – PDF Dönüştürücü" },
      { name: "description", content: "PDF Dönüştürücü, tarayıcınızda çalışan ücretsiz, sınırsız ve güvenli bir PDF ve görsel işleme platformudur." },
      { property: "og:title", content: "PDF Dönüştürücü Hakkında" },
      { property: "og:description", content: "Tarayıcı tabanlı, ücretsiz, sınırsız PDF ve görsel işleme platformu." },
      { property: "og:url", content: "https://pdfdonusturucu.netlify.app/hakkimizda" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.netlify.app/hakkimizda" }],
  }),
  component: About,
});

const VALUES = [
  { icon: Shield, title: "Gizlilik Önce Gelir", text: "Yüklediğiniz hiçbir dosya sunucularımıza ulaşmaz. Tüm işlemler yalnızca sizin cihazınızda gerçekleşir." },
  { icon: Zap, title: "Ücretsiz ve Sınırsız", text: "Günlük limit yok, boyut kısıtı yok, abonelik yok. İhtiyacınız olduğunda istediğiniz kadar kullanın." },
  { icon: Globe, title: "Herkes İçin Erişilebilir", text: "Masaüstü, tablet veya telefon — tüm cihazlardan sorunsuz çalışır. Uygulama yüklemenize gerek yoktur." },
];

const TOOLS = [
  { icon: FileImage, title: "PDF → Görsel", text: "PDF'lerinizi JPEG, PNG veya WebP formatında görsellere dönüştürün. 4 kalite seviyesi, sayfa seçimi ve ZIP indirme desteklenir." },
  { icon: FileType, title: "Görsel → PDF", text: "JPEG, PNG ve WebP görsellerinizi tek bir PDF'te birleştirin. Sıralama ve döndürme özelliği mevcuttur." },
  { icon: Minimize2, title: "PDF Sıkıştır", text: "PDF dosyalarınızın boyutunu küçültün. Sıkıştırma öncesi ve sonrası boyutu karşılaştırın." },
  { icon: ImageDown, title: "Resim Sıkıştır", text: "JPEG, PNG ve WebP görsellerinizi boyut olarak küçültün. Tasarruf yüzdesi anlık gösterilir." },
  { icon: Combine, title: "PDF Birleştir", text: "Birden fazla PDF'i tek belgede toplayın. Sürükleyerek sıralama yapın, dosya sayısı sınırı yoktur." },
  { icon: Scissors, title: "PDF Böl", text: "PDF'i sayfa aralıklarına göre bölerek ayrı dosyalar oluşturun. ZIP olarak toplu indirme desteklenir." },
  { icon: LayoutGrid, title: "Sayfa Düzenle", text: "PDF sayfalarını yeniden sıralayın, döndürün veya gereksiz sayfaları silin. Değişiklikler anlık önizlemede görünür." },
];

function About() {
  return (
    <div className="space-y-10">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">PDF Dönüştürücü Hakkında</h1>
        <p className="text-slate-600 dark:text-slate-400">
          PDF Dönüştürücü, PDF ve görsel dosyalarınızı tamamen tarayıcınızda, sunucuya hiçbir veri göndermeden işlemenizi sağlayan ücretsiz bir araçtır. Kullanıcıların dosyalarını güvenli ve hızlı şekilde dönüştürebileceği, kayıt veya ödeme gerektirmeyen bir platform olarak tasarlanmıştır.
        </p>
      </header>

      <section>
        <div className="grid sm:grid-cols-3 gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-lg">{v.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Araçlarımız</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <div key={t.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center mb-3">
                <t.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}