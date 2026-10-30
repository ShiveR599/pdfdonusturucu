import { createFileRoute } from "@tanstack/react-router";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { seo, SITE_NAME, CONTACT_EMAIL } from "../lib/site";

export const Route = createFileRoute("/iletisim")({
  head: () =>
    seo({
      title: `İletişim – ${SITE_NAME}`,
      description: "Görüş, öneri, hata bildirimi veya KVKK kapsamındaki talepleriniz için e-posta ile iletişime geçin.",
      path: "/iletisim",
    }),
  component: Contact,
});

function Contact() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">İletişim</h1>
        <p className="text-slate-600 dark:text-slate-400">Görüş, öneri veya hata bildirimleriniz için e-posta gönderebilirsiniz.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">E-posta</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary-700 dark:text-primary-300 hover:underline break-all">
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Yanıt Süresi</p>
          <p className="font-semibold">KVKK talepleri en geç 30 gün</p>
        </div>
      </div>

      <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-accent-600 dark:text-accent-400 shrink-0 mt-0.5" />
        <p className="text-sm text-accent-800 dark:text-accent-200">
          KVKK madde 11 kapsamındaki bilgi edinme, düzeltme veya silme talepleriniz için de bu adrese yazabilirsiniz. Lütfen e-postanıza
          dosya veya belge eklemeyin; dosyalarınızı görmemiz gerekmez.
        </p>
      </div>
    </div>
  );
}
