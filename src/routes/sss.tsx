import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/sss")({
  head: () => ({
    meta: [
      { title: "SSS — Sıkça Sorulan Sorular | PDF Dönüştürücü" },
      { name: "description", content: "PDF Dönüştürücü hakkında sıkça sorulan sorular ve yanıtları." },
    ],
  }),
  component: Faq,
});

const Q = [
  { q: "PDF Dönüştürücü ücretsiz mi?", a: "Evet, tüm araçlar tamamen ücretsiz ve sınırsızdır. Gizli abonelik veya premium paket yoktur." },
  { q: "Dosyalarım güvende mi?", a: "%100 güvende. Hiçbir dosya sunucuya yüklenmez; tüm işlemler tarayıcınızda gerçekleşir." },
  { q: "Günlük dosya limiti var mı?", a: "Hayır, hiçbir yapay sınır yoktur." },
  { q: "Aynı anda kaç PDF yükleyebilirim?", a: "Sınır yoktur, istediğiniz kadar PDF yükleyebilirsiniz." },
  { q: "PDF'te belirli sayfaları seçebilir miyim?", a: "Evet, tek PDF yüklendiğinde sayfa aralığı belirlenebilir (1-5, 8, 11-13). Çoklu PDF'te tüm sayfalar listelenir ve bireysel seçilir." },
  { q: "Çıktı kalitesini nasıl seçerim?", a: "PDF→Görsel'de 4 seviye (Standart/İyi/Yüksek/HD), sıkıştırma araçlarında 3 seviye mevcuttur." },
  { q: "Hangi görüntü formatları destekleniyor?", a: "JPEG, PNG ve WebP — hem giriş hem çıkış olarak tüm araçlarda desteklenir." },
  { q: "PNG sıkıştırma nasıl çalışır?", a: "PNG kayıpsız bir formattır; bu nedenle yalnızca boyut küçültme (resize) uygulanır." },
  { q: "İnternet kesilirse ne olur?", a: "Dosya yüklendikten sonra internet kesilse bile işlem devam eder; yalnızca ilk açılışta internet gerekir." },
  { q: "Mobil cihazlardan kullanabilir miyim?", a: "Evet, tüm araçlar mobil uyumludur." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Sıkça Sorulan Sorular</h1>
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
      <InArticleAd />
    </div>
  );
}
