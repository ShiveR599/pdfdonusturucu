import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AD_SLOTS } from "../lib/adSlots";
import { ADSENSE_CLIENT } from "../lib/site";
import { useConsent, loadAdsense } from "../lib/consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Variant = "sidebar" | "mobile" | "inArticle";

/**
 * Reklam alanı. Kullanıcı çerezleri kabul etmediyse HİÇBİR ŞEY göstermez ve Google'a istek
 * gönderilmez. Sayfa değiştiğinde reklam yenilenir.
 */
function AdUnit({ slot, variant }: { slot: string; variant: Variant }) {
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    loadAdsense();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* alan zaten doluysa AdSense hata fırlatır; yok sayılır */
    }
  }, []);

  if (variant === "inArticle") {
    return (
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    );
  }
  if (variant === "sidebar") {
    return (
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "inline-block", width: 160, height: 600 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    );
  }
  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="horizontal"
      data-full-width-responsive="true"
    />
  );
}

/** Sayfa değişince key değişir; böylece reklam alanı yeniden oluşturulup yeni reklam istenir. */
export function AdSlot({ slot, variant, className }: { slot: string; variant: Variant; className?: string }) {
  const consent = useConsent();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (consent !== "accepted") return null;
  return (
    <div className={className} aria-label="Reklam">
      <AdUnit key={path} slot={slot} variant={variant} />
    </div>
  );
}

export function InArticleAd() {
  return <AdSlot slot={AD_SLOTS.inArticle} variant="inArticle" className="my-6 overflow-hidden" />;
}
