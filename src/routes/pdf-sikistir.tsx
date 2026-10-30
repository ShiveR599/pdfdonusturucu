import { createFileRoute } from "@tanstack/react-router";
import { PdfCompress } from "../components/PdfCompress";
import { ToolPage } from "../components/ToolPage";
import { TEXT_PDF_COMPRESS } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/pdf-sikistir")({
  head: () =>
    seo({
      title: "PDF Sıkıştır – Ücretsiz PDF Küçültme",
      description: "Taranmış ve görsel ağırlıklı PDF'lerin boyutunu tarayıcınızda küçültün. 3 sıkıştırma seviyesi, önce/sonra boyut karşılaştırması. Ücretsiz.",
      path: "/pdf-sikistir",
    }),
  component: () => (
    <ToolPage title="PDF Sıkıştır" intro="PDF dosyalarınızı e-posta ve yükleme için küçültün — tarayıcınızda, sunucusuz." text={TEXT_PDF_COMPRESS} current="/pdf-sikistir">
      <PdfCompress />
    </ToolPage>
  ),
});
