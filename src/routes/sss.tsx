import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";
import { seo, SITE_NAME } from "../lib/site";

const Q = [
  { q: "PDF Dönüştürücü ücretsiz mi?", a: "Evet. Tüm araçlar ücretsizdir; üyelik, kayıt veya abonelik gerekmez. Site, reklam çerezlerini kabul eden ziyaretçilere gösterilen reklamlarla ayakta kalır." },
  { q: "Dosyalarım sunucuya yükleniyor mu?", a: "Hayır. Yüklediğiniz dosyalar hiçbir sunucuya gönderilmez ve saklanmaz. Tüm işlemler tarayıcınızda, cihazınızın belleğinde yapılır. Sayfayı kapattığınızda dosyalar bellekten silinir." },
  { q: "Dosya sayısı veya boyut sınırı var mı?", a: "Bizim koyduğumuz bir sınır yoktur. Ancak işlem cihazınızda yapıldığı için çok büyük dosyalarda veya çok sayıda sayfada sınırı cihazınızın belleği belirler. Telefonlarda büyük dosyalar yavaş işlenebilir veya bellek hatası verebilir; bu durumda daha az dosya ya da daha düşük kalite seçin." },
  { q: "PDF'te belirli sayfaları seçebilir miyim?", a: "Evet. PDF'ten Görsele aracında tek PDF yüklendiğinde sayfa aralığı yazabilirsiniz (örneğin: 1-5, 8, 11-13). Birden fazla PDF yüklendiğinde sayfaları tek tek işaretleyebilirsiniz." },
  { q: "Hangi çıktı kalitesini seçmeliyim?", a: "PDF'ten Görsele'de Standart (108 DPI) ekranda görüntüleme için, HD (216 DPI) baskı için uygundur. Sıkıştırma araçlarında e-posta için Yüksek, genel kullanım için Orta, baskı için Düşük sıkıştırma önerilir." },
  { q: "PDF sıkıştırınca yazılar neden seçilemiyor?", a: "PDF Sıkıştır aracı sayfaları görüntüye çevirerek küçültür. Bu nedenle sıkıştırılmış dosyadaki yazılar seçilemez, kopyalanamaz ve aranamaz; bağlantılar ve form alanları da kaldırılır. Bu yöntem en iyi taranmış ve görsel ağırlıklı PDF'lerde sonuç verir. Metin içeriği önemli belgelerde orijinal dosyanızı saklayın." },
  { q: "Sıkıştırılmış dosya neden küçülmedi?", a: "Bazı dosyalar zaten verimli kaydedilmiştir (örneğin yalnızca yazı içeren PDF'ler veya küçük PNG'ler). Sıkıştırma sonucu orijinalden büyük çıkarsa size daha büyük dosya verilmez; orijinal korunur. Daha yüksek bir sıkıştırma seviyesi deneyebilirsiniz." },
  { q: "Hangi dosya formatları destekleniyor?", a: "Giriş: PDF, JPEG, PNG ve WebP. Çıkış: PDF, JPEG, PNG ve WebP. iPhone'daki HEIC fotoğraflar desteklenmez. Safari ve iPhone tarayıcıları WebP kaydedemediği için bu tarayıcılarda WebP çıkış seçeneği kapalıdır." },
  { q: "Şifreli PDF'leri işleyebilir miyim?", a: "Hayır. Açılış veya düzenleme şifresi olan PDF'ler desteklenmez. Önce şifreyi, belgeyi oluşturan programda kaldırmanız gerekir." },
  { q: "PNG sıkıştırma neden farklı çalışıyor?", a: "PNG kayıpsız bir formattır; kalite ayarı PNG'yi etkilemez. PNG görsellerde yalnızca çözünürlük küçültülür." },
  { q: "Mobil cihazdan kullanabilir miyim?", a: "Evet. Tüm araçlar telefon ve tablette çalışır. Sıralama yapılan araçlarda (PDF Birleştir, Görselden PDF'e, Sayfa Düzenle) telefonda sürüklemek yerine ok düğmelerine dokunarak sıralama yapabilirsiniz." },
  { q: "Birden fazla PDF'i tek dosyada birleştirebilir miyim?", a: "Evet. PDF Birleştir aracıyla iki veya daha fazla PDF'i istediğiniz sırayla tek belgede toplayabilirsiniz." },
  { q: "PDF'i belirli sayfalara bölebilir miyim?", a: "Evet. PDF Böl aracıyla '1-3, 5, 8-10' gibi aralıklar yazabilirsiniz; her aralık ayrı bir PDF olur. İsterseniz seçtiğiniz her sayfayı ayrı PDF yapabilirsiniz." },
  { q: "PDF sayfalarını yeniden sıralayabilir veya döndürebilir miyim?", a: "Evet. Sayfa Düzenle aracıyla sayfaları sıralayabilir, 90° döndürebilir ve istemediğiniz sayfaları silebilirsiniz. Değişiklikler önizlemede anında görünür." },
  { q: "IBAN Doğrulama aracı ne işe yarar?", a: "IBAN'ın doğru yazılıp yazılmadığını kontrol eder ve Türk IBAN'larında hangi bankaya ait olduğunu gösterir. Geçerli sonucu, hesabın var olduğunu veya kime ait olduğunu göstermez; para göndermeden önce alıcı adını bankanızın ekranında kontrol edin. Girdiğiniz IBAN hiçbir yere gönderilmez." },
  { q: "Kişisel verilerimi topluyor musunuz?", a: "Hayır. Üyelik, hesap, form veya analiz aracı yoktur; dosyalarınız ve girdiğiniz IBAN numaraları da sunucuya gelmez. Yalnızca sitenin barındırıldığı hizmet sağlayıcı, her web sitesinde olduğu gibi teknik erişim kayıtları (IP adresi, tarayıcı bilgisi gibi) tutar. Çerezleri kabul ederseniz reklamlar Google AdSense tarafından gösterilir ve Google bu amaçla veri işler; reddederseniz reklam yüklenmez. Ayrıntılar Gizlilik Politikası'ndadır." },
];

export const Route = createFileRoute("/sss")({
  head: () => ({
    ...seo({
      title: `Sıkça Sorulan Sorular – ${SITE_NAME}`,
      description: "PDF Dönüştürücü hakkında sık sorulan sorular: ücretsiz mi, dosyalar yükleniyor mu, sınır var mı, hangi formatlar destekleniyor?",
      path: "/sss",
    }),
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
      <div className="space-y-2 max-w-3xl mx-auto">
        {Q.map((it, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className="font-semibold">{it.q}</span>
              <ChevronDown className={`w-5 h-5 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400">{it.a}</div>}
          </div>
        ))}
        <InArticleAd />
      </div>
    </div>
  );
}
