import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "../posts";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post not found – SheConnects",
    };
  }

  return {
    title: `${post.title} – SheConnects`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: PostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/blog"
            className="text-xs font-medium text-violet-700 underline underline-offset-2"
          >
            ← Back to blog
          </Link>
        </div>

        <article>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              {post.category}
            </span>
            <span>{post.displayDate}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-800 sm:text-[15px]">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
