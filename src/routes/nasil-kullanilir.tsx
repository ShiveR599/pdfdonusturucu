import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, SITE_NAME } from "../lib/site";
import type { AnyToolPath } from "../lib/tools";
import { MousePointerClick, Upload, Settings, Download } from "lucide-react";

export const Route = createFileRoute("/nasil-kullanilir")({
  head: () =>
    seo({
      title: `Nasıl Kullanılır – ${SITE_NAME}`,
      description: "PDF'i görsele çevirme, görselden PDF, birleştirme, bölme, sıkıştırma, sayfa düzenleme ve resim sıkıştırma araçlarının adım adım kullanımı.",
      path: "/nasil-kullanilir",
    }),
  component: HowToUse,
});

const STEPS = [
  { icon: MousePointerClick, title: "Aracını Seç", text: "Menüdeki 'Araçlar' bölümünden veya ana sayfadan ihtiyacına uygun aracı seç." },
  { icon: Upload, title: "Dosyanı Yükle", text: "Dosyanı sürükleyip bırak veya dokunarak seç. Dosyan sunucuya gönderilmez." },
  { icon: Settings, title: "Ayarlarını Belirle", text: "Format, kalite, sıkıştırma seviyesi veya sayfa aralığını seç." },
  { icon: Download, title: "İndir", text: "İşlem tarayıcında tamamlanır; sonucu kontrol edip indir." },
];

const DETAILS: { title: string; to: AnyToolPath; items: string[] }[] = [
  {
    title: "PDF → Görsel",
    to: "/pdf-jpg",
    items: [
      "Birden fazla PDF aynı anda yüklenebilir",
      "Tek PDF'te sayfa aralığı belirlenebilir (örn: 1-5, 8, 11-13)",
      "Çoklu PDF'te tüm sayfalar listelenir, sayfa seçimi bireysel yapılır",
      "Çıktı formatı: JPEG, PNG veya WebP",
      "4 kalite seviyesi: Standart (108 DPI), İyi (144 DPI), Yüksek (180 DPI), HD (216 DPI)",
      "Seçilen sayfalar ZIP olarak indirilebilir; her sayfa ayrı ayrı da indirilebilir",
      "Sayfaya dokununca büyütülmüş görünüm açılır",
    ],
  },
  {
    title: "Görsel → PDF",
    to: "/jpg-pdf",
    items: [
      "JPEG, PNG ve WebP dosyaları kabul edilir",
      "Görseller sürükleyerek veya ok düğmeleriyle sıralanabilir",
      "Her görsel 90° döndürülebilir",
      "Tüm görseller tek PDF'te A4 sayfalarına yerleştirilir (yatay görseller yatay sayfaya)",
    ],
  },
  {
    title: "PDF Sıkıştır",
    to: "/pdf-sikistir",
    items: [
      "Sayfalar görüntüye çevrilerek küçültülür; sıkıştırılmış PDF'te yazılar seçilemez",
      "3 sıkıştırma seviyesi: Yüksek, Orta, Düşük (Yüksek Kalite)",
      "İşlem öncesi ve sonrası dosya boyutu ve tasarruf yüzdesi gösterilir",
      "Sonuç orijinalden büyükse orijinal korunur; birden fazla dosya ZIP olarak iner",
    ],
  },
  {
    title: "Resim Sıkıştır",
    to: "/resim-sikistir",
    items: [
      "JPEG, PNG ve WebP dosyaları kabul edilir",
      "Sıkıştırma sonrası boyut ve tasarruf yüzdesi görüntülenir",
      "PNG dosyalarında yalnızca çözünürlük küçültülür (kayıpsız)",
      "Tüm sıkıştırılmış görseller tek ZIP olarak indirilebilir",
    ],
  },
  {
    title: "PDF Birleştir",
    to: "/pdf-birlestir",
    items: [
      "Birden fazla PDF'i tek belgede toplamak için PDF Birleştir aracını kullanın",
      "En az iki PDF yükleyin, sürükleyerek veya oklarla sıralayın ve 'Birleştir' düğmesine basın",
      "Şifreli PDF'ler birleştirilemez",
      "Tüm işlem tarayıcınızda gerçekleşir",
    ],
  },
  {
    title: "PDF Böl",
    to: "/pdf-bol",
    items: [
      "Bir PDF'i belirli sayfa aralıklarına bölmek için PDF Böl aracını kullanın",
      "'1-3, 5, 8-10' formatında sayfa aralıkları girin; her aralık ayrı bir PDF olarak indirilir",
      "Alternatif olarak seçtiğiniz her sayfayı ayrı PDF yapabilirsiniz",
      "Birden fazla aralık tek ZIP olarak indirilir",
    ],
  },
  {
    title: "PDF Sayfa Düzenle",
    to: "/pdf-sayfa-duzenle",
    items: [
      "PDF sayfalarını yeniden sıralamak, döndürmek veya silmek için Sayfa Düzenle aracını kullanın",
      "Sayfaları sürükleyerek veya ok düğmeleriyle yeniden sıralayın",
      "Döndürme butonlarıyla her sayfanın yönünü ayarlayın",
      "İstemediğiniz sayfaları kaldırın ve değişiklikleri tek tıkla uygulayın",
    ],
  },
  {
    title: "IBAN Doğrulama",
    to: "/iban-dogrulama",
    items: [
      "IBAN'ı boşluklu veya boşluksuz yazın ya da yapıştırın; sonuç yazarken anında görünür",
      "Hatalıysa sebebi gösterilir (eksik/fazla hane, yanlış yazılmış rakam vb.)",
      "Türk IBAN'larında hangi bankaya ait olduğu gösterilir; şube ve hesap sahibi bilgisi IBAN'da yer almaz",
      "IBAN hiçbir yere gönderilmez; kontrol tarayıcınızda yapılır",
    ],
  },
];

function HowToUse() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Nasıl Kullanılır</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-primary-600">ADIM {i + 1}</span>
            </div>
            <h3 className="font-bold">{s.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {DETAILS.map((d) => (
          <div key={d.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-3 text-primary-700 dark:text-primary-300">
              <Link to={d.to} className="hover:underline">
                {d.title}
              </Link>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {d.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent-600 shrink-0">•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
