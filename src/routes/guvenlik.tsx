import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudOff, Lock, Cookie, Trash2 } from "lucide-react";
import { seo, SITE_NAME } from "../lib/site";

export const Route = createFileRoute("/guvenlik")({
  head: () =>
    seo({
      title: `Güvenlik – ${SITE_NAME}`,
      description: "Dosyalarınız sunucuya yüklenmez; tüm işlemler tarayıcınızda yapılır. Reklam çerezleri yalnızca onayınızla yüklenir.",
      path: "/guvenlik",
    }),
  component: Security,
});

const CARDS = [
  { icon: CloudOff, title: "Sunucuya Yükleme Yok", text: "Dosyalarınız hiçbir sunucuya gönderilmez. İşlemi yapan kod sayfayla birlikte tarayıcınıza iner ve dosyanız yalnızca cihazınızda işlenir." },
  { icon: Lock, title: "Saklama Yok", text: "Dosyalarınız ve IBAN Doğrulama aracına yazdığınız IBAN'lar kaydedilmez, saklanmaz ve hiçbir yere gönderilmez. Sayfayı kapattığınızda tarayıcı belleğinden silinir." },
  { icon: Cookie, title: "Onaysız Reklam Çerezi Yok", text: "Google reklam sistemi yalnızca çerez bildiriminde 'Kabul Et' derseniz yüklenir. Reddederseniz Google'a hiçbir istek gitmez." },
  { icon: Trash2, title: "Üyelik ve Takip Yok", text: "Üyelik, form veya ziyaretçi analiz aracı yoktur. Sizinle ilgili bir veritabanı tutulmaz." },
];

function Security() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Güvenlik</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Dosyalarınız cihazınızdan çıkmaz.</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {CARDS.map((c) => (
          <div key={c.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center mb-4">
              <c.icon className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg">{c.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{c.text}</p>
          </div>
        ))}
      </div>
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm text-slate-600 dark:text-slate-400 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Kendiniz Doğrulayın</h2>
        <p>
          Bilgisayar tarayıcısında geliştirici araçlarını (F12) açıp "Ağ" (Network) sekmesini izlerken bir dosya işleyin. Dosyanızın hiçbir
          adrese gönderilmediğini görürsünüz.
        </p>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-2">Öneriler</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hassas belgeleri ortak veya başkasına ait cihazlarda işlemeyin.</li>
          <li>İndirdiğiniz dosyaları işiniz bitince "İndirilenler" klasöründen silin.</li>
          <li>Önemli belgelerin orijinallerini her zaman saklayın.</li>
        </ul>
        <p className="pt-2">
          Hangi verilerin nasıl işlendiğinin ayrıntıları için{" "}
          <Link to="/gizlilik-politikasi" className="text-primary-600 dark:text-primary-400 underline">
            Gizlilik Politikası
          </Link>
          'nı okuyabilirsiniz.
        </p>
      </section>
    </div>
  );
}
