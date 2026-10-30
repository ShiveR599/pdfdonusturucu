import { createFileRoute } from "@tanstack/react-router";
import { PdfSplit } from "../components/PdfSplit";
import { ToolPage } from "../components/ToolPage";
import { TEXT_SPLIT } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/pdf-bol")({
  head: () =>
    seo({
      title: "PDF Böl – Ücretsiz PDF Sayfalarını Ayırma",
      description: "PDF'i sayfa aralıklarına göre bölün veya seçtiğiniz sayfaları ayrı PDF yapın. Ücretsiz; dosyanız tarayıcınızda işlenir.",
      path: "/pdf-bol",
    }),
  component: () => (
    <ToolPage title="PDF Böl" intro="PDF'inizi sayfa aralıklarına veya tek tek sayfalara ayırın." text={TEXT_SPLIT} current="/pdf-bol">
      <PdfSplit />
    </ToolPage>
  ),
});
