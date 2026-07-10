import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

const grantAll = () =>
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_personalization: "granted",
    ad_user_data: "granted",
  });

const denyAll = () =>
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_personalization: "denied",
    ad_user_data: "denied",
  });

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("cookie_consent");
    if (v === "accepted") grantAll();
    else if (v === "rejected") denyAll();
    else setShow(true);
  }, []);

  if (!show) return null;

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    grantAll();
    setShow(false);
  };
  const reject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    denyAll();
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5 relative">
        {/* X kapatma = Reddet: KVKK/GDPR'de kullanıcı aktif onay vermediği sürece varsayılan izin yok olmalıdır. */}
        <button onClick={reject} aria-label="Kapat" className="absolute top-3 right-3 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
        <p className="text-sm text-slate-700 dark:text-slate-300 pr-8">
          Bu site, Google Analytics ve Google AdSense aracılığıyla anonim kullanım verileri toplamak ve ilgili reklamlar göstermek için çerezler kullanır. Kabul ederseniz kişiselleştirilmiş reklamlar ve analiz etkinleştirilir. Reddetmeniz hâlinde yalnızca teknik çerezler kullanılır.{" "}
          <Link to="/gizlilik-politikasi" className="text-primary-600 dark:text-primary-400 hover:underline">
            Gizlilik Politikası
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={accept} className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold">
            Kabul Et
          </button>
          <button onClick={reject} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sm font-semibold">
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
