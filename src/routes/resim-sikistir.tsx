import { createFileRoute } from "@tanstack/react-router";
import { ImageCompress } from "../components/ImageCompress";
import { ToolDescription } from "../components/ToolDescription";

export const Route = createFileRoute("/resim-sikistir")({
  head: () => ({
    meta: [
      { title: "Resim Sıkıştır – JPEG PNG WebP" },
      { name: "description", content: "JPEG, PNG ve WebP görsellerinizi tarayıcınızda sıkıştırın. Boyut ve tasarruf yüzdesi gösterilir. Toplu ZIP indirme. Ücretsiz, sınırsız, sunucusuz." },
      { property: "og:title", content: "Resim Sıkıştır" },
      { property: "og:description", content: "JPEG, PNG ve WebP görsellerinizi boyut olarak küçültün. Tasarruf yüzdesi anlık gösterilir. Ücretsiz ve sunucusuz." },
      { property: "og:url", content: "https://pdfdonusturucu.lovable.app/resim-sikistir" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.lovable.app/resim-sikistir" }],
  }),
  component: () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Resim Sıkıştır</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">JPEG, PNG, WebP — ücretsiz, sınırsız, tarayıcı tabanlı.</p>
      </div>
      <ImageCompress />
      <ToolDescription title="Resim Sıkıştırma Nasıl Çalışır?">
        <p>
          Resim Sıkıştır aracı, tarayıcınızın yerleşik Canvas API'sini kullanarak JPEG, PNG ve WebP görsellerinizi boyut olarak küçültür. Hiçbir veri sunucuya gönderilmez.
        </p>
        <p>
          JPEG ve WebP görseller seçilen kalite parametresiyle yeniden kodlanır. PNG görseller kayıpsız formatta olduğundan yalnızca boyut küçültme (yeniden örnekleme) uygulanır; kalite parametresi PNG için etkili değildir.
        </p>
        <p>
          Her görsel için sıkıştırma öncesi ve sonrası boyut ile tasarruf yüzdesi gösterilir. Tümünü ZIP olarak tek seferde indirebilirsiniz. Dosya sayısı sınırı yoktur.
        </p>
      </ToolDescription>
    </div>
  ),
});
