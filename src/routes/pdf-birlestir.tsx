import { createFileRoute } from "@tanstack/react-router";
import { PdfMerge } from "../components/PdfMerge";
import { ToolDescription } from "../components/ToolDescription";

export const Route = createFileRoute("/pdf-birlestir")({
  head: () => ({
    meta: [
      { title: "PDF Birleştir – Ücretsiz Online Araç" },
      { name: "description", content: "Birden fazla PDF dosyasını tek belgede birleştirin. Tarayıcı tabanlı, ücretsiz, sınırsız ve güvenli." },
      { property: "og:title", content: "PDF Birleştir" },
      { property: "og:description", content: "PDF'leri sürükleyip sıralayın ve tek belgede birleştirin." },
      { property: "og:url", content: "https://pdfdonusturucu.lovable.app/pdf-birlestir" },
    ],
    links: [{ rel: "canonical", href: "https://pdfdonusturucu.lovable.app/pdf-birlestir" }],
  }),
  component: () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Birleştir</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">PDF dosyalarınızı tek belgede toplayın — sürükleyerek sıralayın.</p>
      </div>
      <PdfMerge />
      <ToolDescription title="PDF Birleştirme Nasıl Çalışır?">
        <p>
          PDF Birleştir aracı, birden fazla PDF dosyasını tek bir belgede birleştirir. Tüm işlem pdf-lib kütüphanesi aracılığıyla tarayıcınızda gerçekleşir; dosyalarınız hiçbir sunucuya gönderilmez.
        </p>
        <p>
          PDF'leri yükledikten sonra sürükleyerek sıralamayı düzenleyebilirsiniz — birleşik belgede sayfalar bu sıraya göre yer alır. Dosya sayısı sınırı yoktur; sözleşmeler, raporlar veya taranmış belgeler gibi birden fazla PDF'i kolayca tek dosyada toplayabilirsiniz.
        </p>
        <p>
          'PDF'leri Birleştir ve İndir' butonuna tıkladığınızda işlem anında tamamlanır ve birleştirilmiş PDF otomatik olarak indirilir.
        </p>
      </ToolDescription>
    </div>
  ),
});