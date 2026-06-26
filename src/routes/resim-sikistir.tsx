import { createFileRoute } from "@tanstack/react-router";
import { ImageCompress } from "../components/ImageCompress";
import { InArticleAd } from "../components/AdSlot";

export const Route = createFileRoute("/resim-sikistir")({
  head: () => ({
    meta: [
      { title: "Resim Sıkıştır — Ücretsiz Online Görsel Küçültme" },
      { name: "description", content: "JPEG, PNG ve WebP görselleri tarayıcınızda sıkıştırın." },
      { property: "og:title", content: "Resim Sıkıştır" },
      { property: "og:description", content: "Görselleri tarayıcıda hızlıca küçültün." },
    ],
  }),
  component: () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Resim Sıkıştır</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">JPEG, PNG, WebP — ücretsiz, sınırsız, tarayıcı tabanlı.</p>
      </div>
      <ImageCompress />
      <InArticleAd />
    </div>
  ),
});
