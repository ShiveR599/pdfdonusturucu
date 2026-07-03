import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";

const Q = [
  { q: "PDF Dönüştürücü ücretsiz mi?", a: "Evet, tüm araçlar tamamen ücretsiz ve sınırsızdır. Gizli abonelik, premium paket veya kayıt zorunluluğu yoktur." },
  { q: "Dosyalarım güvende mi?", a: "%100 güvende. Yüklediğiniz hiçbir dosya sunucularımıza gönderilmez. Tüm işlemler yalnızca tarayıcınızda gerçekleşir. Dosyalarınız bilgisayarınızdan asla çıkmaz." },
  { q: "Günlük dosya veya boyut limiti var mı?", a: "Hayır, hiçbir yapay sınır yoktur. İstediğiniz kadar dosyayı, istediğiniz boyutta, istediğiniz sıklıkta işleyebilirsiniz." },
  { q: "Aynı anda kaç PDF yükleyebilirim?", a: "Sınır yoktur. İstediğiniz kadar PDF aynı anda yükleyebilirsiniz." },
  { q: "PDF'te belirli sayfaları seçebilir miyim?", a: "Evet. Tek PDF yüklendiğinde sayfa aralığı belirleyebilirsiniz (örneğin: 1-5, 8, 11-13). Birden fazla PDF yüklendiğinde tüm sayfalar listelenir ve istediğiniz sayfaları tek tek seçebilirsiniz." },
  { q: "Hangi çıktı kalitesini seçmeliyim?", a: "PDF'ten Görsele'de 4 seviye var: Standart (108 DPI) günlük ve web kullanımı için, HD (216 DPI) baskı kalitesi için önerilir. PDF ve Resim Sıkıştırma araçlarında 3 seviye var: e-posta için Yüksek, genel için Orta, arşiv için Düşük sıkıştırma önerilir." },
  { q: "Hangi dosya formatları destekleniyor?", a: "Giriş: PDF, JPEG, PNG, WebP. Çıkış: JPEG, PNG, WebP (görsel olarak) ve PDF. Tüm modern tarayıcılar bu formatları destekler." },
  { q: "PNG sıkıştırma neden farklı çalışıyor?", a: "PNG kayıpsız bir formattır; kalite parametresi PNG üzerinde etkili değildir. PNG için yalnızca boyut küçültme (yeniden örnekleme) uygulanır." },
  { q: "İnternet bağlantısı kesilirse ne olur?", a: "Dosya tarayıcıya yüklendikten sonra internet kesilse bile işlem devam eder. Yalnızca sayfayı ilk açarken internet gereklidir." },
  { q: "Mobil cihazdan kullanabilir miyim?", a: "Evet, tüm araçlar mobil uyumludur. Akıllı telefon ve tabletten de sorunsuz kullanabilirsiniz." },
  { q: "Birden fazla PDF'i tek dosyada birleştirebilir miyim?", a: "Evet. PDF Birleştir aracıyla istediğiniz kadar PDF'i tek belgede toplayabilirsiniz. Sıralamayı sürükleyerek düzenleyebilir, ardından tek tıkla birleştirilmiş PDF'i indirebilirsiniz. Tüm işlem tarayıcınızda gerçekleşir." },
  { q: "PDF'i belirli sayfalara bölebilir miyim?", a: "Evet. PDF Böl aracıyla '1-3, 5, 8-10' gibi sayfa aralıkları belirtebilirsiniz; her aralık ayrı bir PDF dosyası olarak oluşturulur. Tüm sayfaları ayrı ayrı bölebilir veya seçtiğiniz aralıkları ZIP olarak indirebilirsiniz." },
  { q: "PDF sayfalarını yeniden sıralayabilir veya döndürebilir miyim?", a: "Evet. Sayfa Düzenle aracıyla sayfaları sürükleyerek istediğiniz sıraya getirebilir, her sayfayı 90° döndürebilir ve istemediğiniz sayfaları silebilirsiniz. Değişiklikler anında önizlemeye yansır." },
];

export const Route = createFileRoute("/sss")({
  head: () => ({
    meta: [
      { title: "Sıkça Sorulan Sorular – PDF Dönüştürücü" },
      { name: "description", content: "PDF Dönüştürücü hakkında sık sorulan sorular: ücretsiz mi, güvenli mi, limit var mı, hangi formatlar destekleniyor ve daha fazlası." },
      { property: "og:title", content: "SSS — PDF Dönüştürücü" },
      { property: "og:description", content: "PDF Dönüştürücü araçları hakkında sıkça sorulan sorular." },
      { property: "og:url", content: "https://pdfdonusturucu.lovable.app/sss" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.lovable.app/sss" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: Q.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Sıkça Sorulan Sorular</h1>
      <InArticleAd />
      <div className="space-y-2 max-w-3xl mx-auto">
        {Q.map((it, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <span className="font-semibold">{it.q}</span>
              <ChevronDown className={`w-5 h-5 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400">{it.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
