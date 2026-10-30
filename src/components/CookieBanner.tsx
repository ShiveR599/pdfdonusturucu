import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { setConsent, useBannerVisible, useConsent, loadAdsense } from "../lib/consent";

export function CookieBanner() {
  const visible = useBannerVisible();
  const consent = useConsent();

  // Daha önce kabul edildiyse reklam betiğini yükle; aksi hâlde Google'a hiçbir istek gitmez.
  useEffect(() => {
    if (consent === "accepted") loadAdsense();
  }, [consent]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Çerez tercihleri"
        className="pointer-events-auto max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5"
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Sitenin ücretsiz kalabilmesi için reklam göstermek istiyoruz. <strong>Kabul ederseniz</strong> Google AdSense reklam
          çerezleri kullanılır ve cihaz/kullanım bilgileriniz reklam amacıyla Google'a (yurt dışına) aktarılır.{" "}
          <strong>Reddederseniz</strong> reklam yüklenmez ve Google'a hiçbir veri gönderilmez; tüm araçlar yine eksiksiz çalışır.
          Yüklediğiniz dosyalar her durumda yalnızca cihazınızda işlenir.{" "}
          <Link to="/gizlilik-politikasi" className="text-primary-600 dark:text-primary-400 underline">
            Gizlilik Politikası
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setConsent("accepted")}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold"
          >
            Kabul Et
          </button>
          <button
            onClick={() => setConsent("rejected")}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
