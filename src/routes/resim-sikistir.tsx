import { createFileRoute } from "@tanstack/react-router";
import { ImageCompress } from "../components/ImageCompress";
import { ToolPage } from "../components/ToolPage";
import { TEXT_IMAGE_COMPRESS } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/resim-sikistir")({
  head: () =>
    seo({
      title: "Resim Sıkıştır – JPEG, PNG, WebP Küçültme",
      description: "JPEG, PNG ve WebP görsellerinizi tarayıcınızda sıkıştırın. Önce/sonra boyutu gösterilir, toplu ZIP indirme. Ücretsiz; görseller sunucuya yüklenmez.",
      path: "/resim-sikistir",
    }),
  component: () => (
    <ToolPage title="Resim Sıkıştır" intro="JPEG, PNG ve WebP görsellerinizi küçültün — tarayıcınızda, sunucusuz." text={TEXT_IMAGE_COMPRESS} current="/resim-sikistir">
      <ImageCompress />
    </ToolPage>
  ),
});
