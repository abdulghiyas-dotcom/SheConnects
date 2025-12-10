import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "./posts";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog – SheConnects",
  description:
    "Stories, insights, and updates from SheConnects – a remote service studio powered by Afghan women.",
};

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
            SheConnects blog
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Stories from our remote studio
          </h1>
          <p className="mt-2 text-sm text-slate-700 sm:text-base">
            Reflections on digital work, social impact, and practical tips for NGOs,
            social enterprises, and impact-driven teams working with remote talent.
          </p>
        </div>

        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                  {post.category}
                </span>
                <span>{post.displayDate}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-violet-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-slate-700">{post.excerpt}</p>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-violet-700 underline underline-offset-2"
                >
                  Read more
                </Link>

                {/* Optional: quick link back to homepage */}
                <Link
                  href="/#hero"
                  className="text-xs text-slate-500 hover:text-violet-700"
                >
                  ← Back to homepage
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
