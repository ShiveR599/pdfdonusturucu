import { createFileRoute } from "@tanstack/react-router";
import { PdfCompress } from "../components/PdfCompress";
import { ToolDescription } from "../components/ToolDescription";

export const Route = createFileRoute("/pdf-sikistir")({
  head: () => ({
    meta: [
      { title: "PDF Sıkıştır — Ücretsiz Online PDF Küçültme" },
      { name: "description", content: "PDF dosyalarınızı tarayıcınızda ücretsiz ve sınırsız sıkıştırın." },
      { property: "og:title", content: "PDF Sıkıştır" },
      { property: "og:description", content: "PDF dosyalarınızı tarayıcınızda küçültün." },
    ],
  }),
  component: () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Sıkıştır</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Dosyalarınızı tarayıcınızda sıkıştırın — sunucusuz, sınırsız.</p>
      </div>
      <PdfCompress />
      <ToolDescription title="PDF Sıkıştırma Nasıl Çalışır?">
        <p>
          PDF Sıkıştır aracı, yüklediğiniz PDF dosyasının her sayfasını seçilen kalite seviyesinde işleyerek dosya boyutunu küçültür. Tüm işlem tarayıcınızda gerçekleşir; dosyalarınız sunucuya gönderilmez.
        </p>
        <p>
          Üç farklı sıkıştırma seviyesi mevcuttur: Yüksek sıkıştırma maksimum boyut azaltması sağlar ve e-posta veya mesajlaşma için idealdir. Orta sıkıştırma kalite ile boyut arasında denge kurar ve çoğu kullanım için önerilir. Düşük sıkıştırma ise görsel kaliteyi koruyarak minimal boyut azaltması yapar; baskı veya arşiv için uygundur.
        </p>
        <p>
          Sıkıştırma tamamlandığında orijinal boyut, yeni boyut ve tasarruf yüzdesi ekranda gösterilir. Birden fazla PDF yükleyip tümünü ZIP olarak indirebilirsiniz.
        </p>
      </ToolDescription>
    </div>
  ),
});
