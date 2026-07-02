import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gizlilik-politikasi")({
  head: () => ({
    meta: [
      { title: "Gizlilik Politikası – PDF Dönüştürücü" },
      { name: "description", content: "KVKK uyumlu gizlilik politikası ve çerez kullanım bilgileri." },
      { property: "og:title", content: "Gizlilik Politikası — PDF Dönüştürücü" },
      { property: "og:description", content: "KVKK uyumlu gizlilik politikası ve çerez kullanımı." },
      { property: "og:url", content: "https://pdfdonusturucu.lovable.app/gizlilik-politikasi" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.lovable.app/gizlilik-politikasi" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Gizlilik Politikası</h1>

      <h2 className="text-lg font-bold mt-6 mb-2">Veri Sorumlusu</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        PDF Dönüştürücü — İletişim: info@pdfdonusturucu.net
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">İşlenen Veriler</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Yüklediğiniz dosyalar yalnızca tarayıcınızda işlenir; sunucularımıza iletilmez, kaydedilmez.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Çerezler ve Analitik</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Google Analytics (anonim, IP anonimleştirilmiş) yalnızca kullanıcı onayı sonrası aktif hâle gelir. Onay verilmediğinde herhangi bir analitik veri toplanmaz.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Reklam Çerezleri</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Google AdSense, kullanıcı onayı sonrası kişiselleştirilmiş reklam gösterebilir. Reddetmeniz hâlinde yalnızca kişiselleştirilmemiş reklamlar veya hiç reklam görüntülenmeyebilir.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Kullanıcı Hakları (KVKK Madde 11)</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini, silinmesini talep etme ve işlenmesine itiraz etme hakkına sahipsiniz.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Çerez Tercihleri</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Çerez tercihlerinizi istediğiniz zaman çerez banner'ı aracılığıyla değiştirebilirsiniz. Banner görünmüyorsa tarayıcınızın site verilerini temizleyerek yeniden gösterilmesini sağlayabilirsiniz.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">İletişim</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">info@pdfdonusturucu.net</p>

      <p className="text-xs text-slate-500 mt-8">Son güncelleme: Haziran 2026</p>
    </article>
  );
}
