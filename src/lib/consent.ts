import { useSyncExternalStore } from "react";
import { ADSENSE_CLIENT } from "./site";

// Çerez onayı: "unknown" = henüz seçim yapılmadı, "accepted" / "rejected".
// Google AdSense betiği YALNIZCA kullanıcı "Kabul Et" dedikten sonra yüklenir.
// Onay verilmezse Google'a hiçbir istek gitmez ve reklam gösterilmez.

export type Consent = "unknown" | "accepted" | "rejected";

const KEY = "cookie_consent";
const listeners = new Set<() => void>();
let bannerOpen = false;

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : "unknown";
  } catch {
    return "unknown";
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let adsenseLoaded = false;
export function loadAdsense() {
  if (adsenseLoaded || typeof document === "undefined") return;
  adsenseLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(s);
}

export function setConsent(v: "accepted" | "rejected") {
  const prev = read();
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  bannerOpen = false;
  if (v === "accepted") loadAdsense();
  // Önceden kabul edilmişti ve şimdi reddedildi: yüklenmiş reklam betiğini
  // durdurmanın tek güvenilir yolu sayfayı yenilemektir.
  if (prev === "accepted" && v === "rejected") {
    window.location.reload();
    return;
  }
  emit();
}

export function openConsentBanner() {
  bannerOpen = true;
  emit();
}

export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => "unknown");
}

export function useBannerVisible(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => bannerOpen || read() === "unknown",
    () => false,
  );
}
