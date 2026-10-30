import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Zap, Globe } from "lucide-react";
import { ALL_TOOLS } from "../lib/tools";
import { seo, SITE_NAME } from "../lib/site";

export const Route = createFileRoute("/hakkimizda")({
  head: () =>
    seo({
      title: `Hakkımızda – ${SITE_NAME}`,
      description: "PDF Dönüştürücü, dosyaları sunucuya yüklemeden tarayıcıda işleyen ücretsiz bir PDF ve görsel araçları sitesidir.",
      path: "/hakkimizda",
    }),
  component: About,
});

const VALUES = [
  { icon: Shield, title: "Önce Gizlilik", text: "Yüklediğiniz dosyalar sunucuya ulaşmaz. Tüm işlemler yalnızca sizin cihazınızda gerçekleşir." },
  { icon: Zap, title: "Ücretsiz ve Kayıtsız", text: "Üyelik, abonelik veya günlük kullanım sınırı yoktur. Sınırı yalnızca cihazınızın belleği belirler." },
  { icon: Globe, title: "Her Cihazda", text: "Bilgisayar, tablet veya telefon — uygulama yüklemeden, güncel bir tarayıcıyla çalışır." },
];

function About() {
  return (
    <div className="space-y-10">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{SITE_NAME} Hakkında</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {SITE_NAME}, PDF ve görsel dosyalarınızı sunucuya göndermeden, doğrudan tarayıcınızda işlemenizi sağlayan ücretsiz bir araç
          sitesidir. Amacımız; günlük hayatta sık ihtiyaç duyulan PDF işlemlerini kayıt, ödeme veya dosya paylaşma kaygısı olmadan
          yapabilmenizi sağlamaktır.
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
          {ALL_TOOLS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-primary-400 transition"
            >
              <h3 className="font-semibold">{t.label}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
