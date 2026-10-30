import { createFileRoute } from "@tanstack/react-router";
import { ImageToPdf } from "../components/ImageToPdf";
import { ToolPage } from "../components/ToolPage";
import { TEXT_IMAGE_TO_PDF } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/jpg-pdf")({
  head: () =>
    seo({
      title: "JPG'den PDF'e – Görselleri Ücretsiz PDF Yapma",
      description: "JPG, PNG ve WebP görselleri sıralayıp döndürerek tek PDF dosyası yapın. Ücretsiz; görseller tarayıcınızda işlenir, sunucuya yüklenmez.",
      path: "/jpg-pdf",
    }),
  component: () => (
    <ToolPage title="Görselden PDF'e Dönüştür" intro="Fotoğraflarınızı ve taramalarınızı tek bir PDF'te toplayın." text={TEXT_IMAGE_TO_PDF} current="/jpg-pdf">
      <ImageToPdf />
    </ToolPage>
  ),
});
