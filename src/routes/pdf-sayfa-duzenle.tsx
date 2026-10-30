import { createFileRoute } from "@tanstack/react-router";
import { PdfPagesEdit } from "../components/PdfPagesEdit";
import { ToolPage } from "../components/ToolPage";
import { TEXT_EDIT } from "../lib/toolTexts";
import { seo } from "../lib/site";

export const Route = createFileRoute("/pdf-sayfa-duzenle")({
  head: () =>
    seo({
      title: "PDF Sayfa Düzenle – Sayfa Sırala, Döndür, Sil",
      description: "PDF sayfalarını yeniden sıralayın, döndürün veya silin. Ücretsiz; dosyanız tarayıcınızda işlenir, sunucuya yüklenmez.",
      path: "/pdf-sayfa-duzenle",
    }),
  component: () => (
    <ToolPage title="PDF Sayfa Düzenle" intro="Sayfaları sıralayın, döndürün veya silin — kalite kaybı olmadan." text={TEXT_EDIT} current="/pdf-sayfa-duzenle">
      <PdfPagesEdit />
    </ToolPage>
  ),
});
