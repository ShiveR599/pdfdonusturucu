import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "../lib/site";
import { TOOLS } from "../lib/tools";
import { POSTS } from "../lib/blogPosts";

type Entry = { path: string; changefreq?: string; priority?: string; lastmod?: string };

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  ...TOOLS.map((t) => ({ path: t.to, changefreq: "monthly", priority: "0.9" })),
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "yearly", priority: "0.6", lastmod: p.date })),
  { path: "/sss", changefreq: "monthly", priority: "0.6" },
  { path: "/nasil-kullanilir", changefreq: "monthly", priority: "0.5" },
  { path: "/ozelliklerimiz", changefreq: "monthly", priority: "0.4" },
  { path: "/guvenlik", changefreq: "monthly", priority: "0.4" },
  { path: "/hakkimizda", changefreq: "yearly", priority: "0.3" },
  { path: "/iletisim", changefreq: "yearly", priority: "0.3" },
  { path: "/gizlilik-politikasi", changefreq: "yearly", priority: "0.2" },
  { path: "/kullanim-kosullari", changefreq: "yearly", priority: "0.2" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map(
            (e) =>
              `  <url><loc>${SITE_URL}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`,
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
