import { useEffect, useRef } from "react";
import { AD_SLOTS } from "../lib/adSlots";

export function InArticleAd() {
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);
  return (
    <div className="my-6 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden">
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8147032819898233"
        data-ad-slot={AD_SLOTS.inArticle}
      />
    </div>
  );
}
