import { createFileRoute } from "@tanstack/react-router";
import { PdfToImage } from "../components/PdfToImage";
import { ToolPage } from "../components/ToolPage";
import { TEXT_PDF_TO_IMAGE } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/pdf-jpg")({
  head: () =>
    seo({
      title: "PDF'ten JPG'ye Dönüştür – Ücretsiz PDF'i Görsele Çevirme",
      description: "PDF sayfalarını JPG, PNG veya WebP görsele çevirin. 4 çözünürlük seviyesi, sayfa seçimi ve ZIP indirme. Ücretsiz; dosyalar tarayıcınızda işlenir.",
      path: "/pdf-jpg",
    }),
  component: () => (
    <ToolPage title="PDF'ten Görsele Dönüştür" intro="PDF sayfalarını JPG, PNG veya WebP görsele çevirin — dosyalarınız cihazınızdan çıkmaz." text={TEXT_PDF_TO_IMAGE} current="/pdf-jpg">
      <PdfToImage />
    </ToolPage>
  ),
});
