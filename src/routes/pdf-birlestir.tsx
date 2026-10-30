import { createFileRoute } from "@tanstack/react-router";
import { PdfMerge } from "../components/PdfMerge";
import { ToolPage } from "../components/ToolPage";
import { TEXT_MERGE } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/pdf-birlestir")({
  head: () =>
    seo({
      title: "PDF Birleştir – Ücretsiz Online PDF Birleştirme",
      description: "Birden fazla PDF dosyasını istediğiniz sırayla tek belgede birleştirin. Ücretsiz; dosyalar tarayıcınızda işlenir, sunucuya yüklenmez.",
      path: "/pdf-birlestir",
    }),
  component: () => (
    <ToolPage title="PDF Birleştir" intro="PDF dosyalarınızı tek belgede toplayın — sıralamayı istediğiniz gibi ayarlayın." text={TEXT_MERGE} current="/pdf-birlestir">
      <PdfMerge />
    </ToolPage>
  ),
});
