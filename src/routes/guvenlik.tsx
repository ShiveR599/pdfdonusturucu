import { createFileRoute } from "@tanstack/react-router";
import { CloudOff, Lock, Eye, Server, ShieldCheck } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/guvenlik")({
  head: () => ({
    meta: [
      { title: "Güvenlik — PDF Dönüştürücü" },
      { name: "description", content: "Tüm işlemler tarayıcınızda gerçekleşir. Dosyalarınız sunucuya yüklenmez." },
    ],
  }),
  component: Security,
});

const CARDS = [
  { icon: CloudOff, title: "Sunucusuz İşlem", text: "Tüm işlemler %100 tarayıcınızda gerçekleşir, hiçbir dosya sunucuya gönderilmez." },
  { icon: Lock, title: "Veri Gizliliği", text: "Dosyalarınız sunucularımıza yüklenmez, işlenmez veya saklanmaz, bilgisayarınızdan asla çıkmaz." },
  { icon: Eye, title: "Görünürlük Yok", text: "Üçüncü tarafların dosyalarınıza erişimi yoktur, işlemler tamamen cihazınızda gerçekleşir." },
  { icon: Server, title: "Arka Plan Yok", text: "Arka planda çalışan hiçbir veri toplama veya işleme süreci yoktur." },
];

function Security() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Güvenlik</h1>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
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
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-2xl p-6 flex items-center gap-4">
        <ShieldCheck className="w-10 h-10 shrink-0" />
        <p className="font-semibold">KVKK uyumlu gizlilik politikası ile korunan bir hizmettir.</p>
      </div>
      <InArticleAd />
    </div>
  );
}
