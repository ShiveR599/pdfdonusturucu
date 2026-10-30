import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { InArticleAd } from "../components/AdSlot";
import { getPost, formatDate, POSTS } from "../lib/blogPosts";
import { seo, SITE_NAME, SITE_URL, OG_IMAGE } from "../lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: `Yazı bulunamadı – ${SITE_NAME}` }, { name: "robots", content: "noindex" }] };
    const p = loaderData;
    const base = seo({ title: `${p.title} – ${SITE_NAME}`, description: p.description, path: `/blog/${p.slug}`, type: "article" });
    return {
      ...base,
      meta: [...base.meta, { property: "article:published_time", content: p.date }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.date,
            inLanguage: "tr",
            image: OG_IMAGE,
            mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
          }),
        },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const p = Route.useLoaderData();
  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Tüm yazılar
      </Link>
      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{p.title}</h1>
        <div className="flex flex-wrap gap-2 text-xs mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Calendar className="w-3 h-3" /> <time dateTime={p.date}>{formatDate(p.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
            <Tag className="w-3 h-3" /> {p.tag}
          </span>
        </div>
        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          {p.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4">{b.h}</h2>}
              {b.p && <p>{b.p}</p>}
              {b.list && (
                <ul className="list-disc pl-5 space-y-1.5">
                  {b.list.map((li, j) => (
                    <li key={j}>{li}</li>
                  ))}
                </ul>
              )}
              {b.steps && (
                <ol className="list-decimal pl-5 space-y-1.5">
                  {b.steps.map((li, j) => (
                    <li key={j}>{li}</li>
                  ))}
                </ol>
              )}
              {i === 2 && <InArticleAd />}
            </div>
          ))}
        </div>
        {p.tool && (
          <Link
            to={p.tool.to}
            className="mt-8 inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold"
          >
            {p.tool.label}
          </Link>
        )}
      </article>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Diğer Yazılar</h2>
        <div className="space-y-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/blog/$slug"
              params={{ slug: o.slug }}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-primary-400"
            >
              <span className="font-semibold text-sm">{o.title}</span>
              <span className="block text-xs text-slate-500 mt-1">{o.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
