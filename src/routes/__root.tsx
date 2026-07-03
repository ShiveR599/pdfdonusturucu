import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Layout } from "../components/Layout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sayfa Bulunamadı</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sayfa Yüklenemedi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bir hata oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PDF Dönüştürücü – Ücretsiz & Güvenli" },
      { name: "google-site-verification", content: "lNvdKACSDfKuIJF8QPzUubeb3mXGmtoCZ3pFF8ZLJow" },
      { name: "description", content: "PDF dönüştür, birleştir, böl, sıkıştır ve sayfa düzenle. Görselleri PDF'e ekle. Ücretsiz, sınırsız ve tarayıcıda güvenli." },
      { name: "keywords", content: "pdf dönüştürücü, pdf birleştir, pdf böl, pdf sıkıştır, pdf sayfa düzenle, pdf sayfaları yeniden sırala, pdf sayfa döndür, pdf birleştirme, pdf bölme, pdf jpeg çevirme, pdf png çevirme, pdf webp dönüştürme, jpg pdf yapma, png pdf yapma, webp pdf yapma, pdf küçültme, resim sıkıştırma, görsel küçültme, fotoğraf sıkıştırma, ücretsiz pdf dönüştür, online pdf dönüştürücü, pdf görsel çevirici, pdf araçları, dosya sıkıştırma online, tarayıcıda pdf işleme, güvenli pdf dönüştürücü, sınırsız pdf dönüştürücü, pdf to image, image to pdf, compress pdf online, merge pdf online, split pdf online, pdf küçük yapma, resim boyutu küçültme, toplu pdf dönüştürme, pdf sayfaları birleştir, pdf parçala, pdf ayır, pdf düzenle" },
      { property: "og:title", content: "PDF Dönüştürücü – Ücretsiz & Güvenli" },
      { property: "og:description", content: "PDF dönüştür, birleştir, böl, sıkıştır ve sayfa düzenle. Ücretsiz, sınırsız ve tarayıcıda güvenli." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PDF Dönüştürücü" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PDF Dönüştürücü – Ücretsiz & Güvenli" },
      { name: "twitter:description", content: "PDF dönüştür, birleştir, böl, sıkıştır ve sayfa düzenle. Ücretsiz, sınırsız ve tarayıcıda güvenli." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://pagead2.googlesyndication.com" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_personalization':'denied','ad_user_data':'denied','wait_for_update':500});gtag('js', new Date());gtag('config','G-YDCM4WQ58R');`,
      },
      { src: "https://www.googletagmanager.com/gtag/js?id=G-YDCM4WQ58R", async: true },
      { src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8147032819898233", async: true, crossOrigin: "anonymous" },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "PDF Dönüştürücü",
          url: "https://pdfdonusturucu.lovable.app/",
          description: "PDF dönüştür, birleştir, böl ve sıkıştır. Görsel işleme araçları. %100 ücretsiz, sunucusuz, güvenli.",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web Browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
          inLanguage: "tr",
          featureList: [
            "PDF'ten Görsele Dönüştürme",
            "Görsellerden PDF Oluşturma",
            "PDF Sıkıştırma",
            "Resim Sıkıştırma",
            "PDF Birleştirme",
            "PDF Bölme",
            "PDF Sayfa Düzenleme",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  );
}
