import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://pdfdonusturucu.lovable.app";

const entries: Array<{ path: string; changefreq?: string; priority?: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pdf-sikistir", changefreq: "weekly", priority: "0.9" },
  { path: "/resim-sikistir", changefreq: "weekly", priority: "0.9" },
  { path: "/pdf-birlestir", changefreq: "weekly", priority: "0.9" },
  { path: "/ozelliklerimiz", changefreq: "monthly", priority: "0.6" },
  { path: "/sss", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "monthly", priority: "0.7" },
  { path: "/nasil-kullanilir", changefreq: "monthly", priority: "0.6" },
  { path: "/guvenlik", changefreq: "monthly", priority: "0.6" },
  { path: "/hakkimizda", changefreq: "monthly", priority: "0.5" },
  { path: "/iletisim", changefreq: "monthly", priority: "0.5" },
  { path: "/gizlilik-politikasi", changefreq: "yearly", priority: "0.4" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});