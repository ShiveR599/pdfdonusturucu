import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Tag } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";
import { POSTS, formatDate } from "../lib/blogPosts";
import { seo, SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const base = seo({
      title: `Blog ve Rehberler – ${SITE_NAME}`,
      description: "PDF küçültme, birleştirme, bölme ve görsel formatları hakkında pratik rehberler.",
      path: "/blog",
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE_NAME} Blog`,
            url: `${SITE_URL}/blog`,
            inLanguage: "tr",
            blogPost: POSTS.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${SITE_URL}/blog/${p.slug}`,
              datePublished: p.date,
              author: { "@type": "Organization", name: SITE_NAME },
            })),
          }),
        },
      ],
    };
  },
  component: BlogIndex,
});

function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF ve Görsel İşleme Rehberleri</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">PDF ve görsel dosyalar hakkında pratik bilgiler.</p>
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        {posts.map((p, i) => (
          <div key={p.slug}>
            <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-3">
              <h2 className="text-lg font-bold">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {p.title}
                </Link>
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3 h-3" /> <time dateTime={p.date}>{formatDate(p.date)}</time>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                  <Tag className="w-3 h-3" /> {p.tag}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{p.description}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="inline-block text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Devamını oku →
              </Link>
            </article>
            {i === 1 && <InArticleAd />}
          </div>
        ))}
      </div>
    </div>
  );
}
