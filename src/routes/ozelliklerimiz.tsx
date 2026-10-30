import { createFileRoute } from "@tanstack/react-router";
import { Zap, CheckSquare, Image, Sparkles, ArrowUpDown, Shield } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";
import { seo, SITE_NAME } from "../lib/site";

export const Route = createFileRoute("/ozelliklerimiz")({
  head: () =>
    seo({
      title: `Özellikler – ${SITE_NAME}`,
      description: "Ücretsiz, kayıtsız ve tarayıcıda çalışan PDF Dönüştürücü'nün öne çıkan özellikleri.",
      path: "/ozelliklerimiz",
    }),
  component: Features,
});

const CARDS = [
  { icon: Zap, title: "Ücretsiz ve Kayıtsız", text: "Üyelik, abonelik veya günlük işlem sınırı olmadan kullanın. Sınırı yalnızca cihazınızın belleği belirler." },
  { icon: CheckSquare, title: "Esnek Sayfa Seçimi", text: "PDF sayfalarını tek tek seçin, sayfa aralığı yazın veya toplu işaretleyin." },
  { icon: Image, title: "Çoklu Format Desteği", text: "JPEG, PNG ve WebP formatlarında çıktı alın veya bu formatlardaki görselleri PDF'e dönüştürün." },
  { icon: Sparkles, title: "4 Çözünürlük Seviyesi", text: "Ekran için Standart'tan baskı için HD'ye (108–216 DPI) dört farklı seçenek." },
  { icon: ArrowUpDown, title: "Kolay Sıralama", text: "Bilgisayarda sürükleyerek, telefonda ok düğmeleriyle sıralayın; döndürün ve toplu ZIP olarak indirin." },
  { icon: Shield, title: "Dosyalar Cihazınızda Kalır", text: "Dosyalarınız hiçbir sunucuya yüklenmez; tüm işlemler tarayıcınızda gerçekleşir." },
];

function Features() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Özellikler</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <div key={c.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center mb-4">
              <c.icon className="w-6 h-6" />
            </div>
            <h2 className="font-bold">{c.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{c.text}</p>
          </div>
        ))}
      </div>
      <InArticleAd />
    </div>
  );
}
