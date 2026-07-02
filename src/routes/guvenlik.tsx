import { createFileRoute } from "@tanstack/react-router";
import { CloudOff, Lock, Eye, Server } from "lucide-react";

export const Route = createFileRoute("/guvenlik")({
  head: () => ({
    meta: [
      { title: "Güvenlik & Gizlilik – PDF Dönüştürücü" },
      { name: "description", content: "Tüm işlemler tarayıcınızda gerçekleşir. Dosyalarınız sunucuya yüklenmez. KVKK uyumlu gizlilik politikamızı okuyun." },
      { property: "og:title", content: "Güvenlik & Gizlilik — PDF Dönüştürücü" },
      { property: "og:description", content: "Tüm işlemler tarayıcınızda. Dosyalar sunucuya yüklenmez. KVKK uyumlu." },
      { property: "og:url", content: "https://pdfdonusturucu.lovable.app/guvenlik" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.lovable.app/guvenlik" }],
  }),
  component: Security,
});

const CARDS = [
  { icon: CloudOff, title: "Sunucusuz İşlem", text: "Tüm işlemler %100 tarayıcınızda gerçekleşir, hiçbir dosya sunucuya gönderilmez." },
  { icon: Lock, title: "Veri Gizliliği", text: "Dosyalarınız sunucularımıza yüklenmez, işlenmez veya saklanmaz, bilgisayarınızdan asla çıkmaz." },
  { icon: Eye, title: "Görünürlük Yok", text: "Üçüncü tarafların dosyalarınıza erişimi yoktur, işlemler tamamen cihazınızda gerçekleşir." },
  { icon: Server, title: "Arka Plan Yok", text: "Arka planda çalışan hiçbir veri toplama veya işleme süreci yoktur." },
];

const PRIVACY = [
  { title: "Veri Sorumlusu", text: "PDF Dönüştürücü — pdfdonusturucu.netlify.app" },
  { title: "İşlenen Veriler", text: "Yüklediğiniz dosyalar yalnızca tarayıcınızda işlenir. Sunucularımıza iletilmez, kaydedilmez veya saklanmaz." },
  { title: "Çerezler ve Analitik", text: "Google Analytics kullanılmaktadır. Yalnızca kullanıcı onayı sonrasında aktif olur. IP adresleri anonimleştirilir." },
  { title: "Reklam Çerezleri", text: "Google AdSense kullanılmaktadır. Kullanıcı onayı sonrasında kişiselleştirilmiş reklam gösterilebilir." },
  { title: "Kullanıcı Hakları (KVKK Madde 11)", text: "Bilgi edinme, düzeltme, silme ve itiraz haklarınız için iletişim adresimize yazabilirsiniz." },
  { title: "Çerez Tercihleri", text: "Tercihlerinizi sayfanın alt kısmındaki banner üzerinden istediğiniz zaman değiştirebilirsiniz." },
  { title: "İletişim", text: "info@pdfdonusturucu.net" },
];

function Security() {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Güvenlik & Gizlilik</h1>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {CARDS.map((c) => (
          <div key={c.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center mb-4">
              <c.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">{c.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{c.text}</p>
          </div>
        ))}
      </div>

      <section id="gizlilik-politikasi" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Gizlilik Politikası</h2>
        <dl className="space-y-4">
          {PRIVACY.map((p) => (
            <div key={p.title}>
              <dt className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400 mt-1">{p.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Son güncelleme: Haziran 2026</p>
      </section>
    </div>
  );
}
