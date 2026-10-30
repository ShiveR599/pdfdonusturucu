// Sitenin tüm sabit bilgileri tek yerde. Alan adı, e-posta veya isim değişirse
// yalnızca bu dosyayı güncellemeniz yeterlidir.

export const SITE_NAME = "PDF Dönüştürücü";
export const SITE_URL = "https://pdfdonusturucu.netlify.app";

// ÖNEMLİ: Yayına almadan önce kendi kontrolünüzdeki gerçek bir e-posta adresi yazın.
// KVKK başvuruları bu adrese gelir; size ait olmayan bir adres yazılmamalıdır.
export const CONTACT_EMAIL = "osmandemiray5926@gmail.com";

// ÖNEMLİ: KVKK aydınlatma metninde veri sorumlusunun adı/unvanı yer almalıdır.
// Gerçek kişi olarak işletiyorsanız adınızı soyadınızı yazın (ör. "Ad Soyad").
export const OWNER_NAME = "Osman DEMİRAY";

// Siteyi yayınlayan barındırma hizmeti (gizlilik politikasında adı geçer).
export const HOSTING_PROVIDER = "Netlify, Inc. (ABD)";

export const ADSENSE_CLIENT = "ca-pub-8147032819898233";

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const POLICY_UPDATED = "Ekim 2026";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

/** Her sayfa için tutarlı başlık, açıklama, canonical ve paylaşım etiketleri üretir. */
export function seo({ title, description, path, type = "website" }: SeoInput) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
