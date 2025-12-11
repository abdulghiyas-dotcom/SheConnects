"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import { BlogPost } from "../blog/posts";
import {
  Language,
  SiteContent,
  defaultLanguage,
  translations,
} from "../lib/translations";

function normalizeLanguage(value: Language | string | undefined): Language {
  return value === "it" ? "it" : "en";
}

type BlogContentProps = {
  initialLanguage?: Language;
  posts: BlogPost[];
};

export default function BlogContent({
  initialLanguage = defaultLanguage,
  posts,
}: BlogContentProps) {
  const [language, setLanguage] = useState<Language>(
    normalizeLanguage(initialLanguage)
  );

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const content: SiteContent = useMemo(() => translations[language], [language]);

  return (
    <>
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
            {content.blog.label}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {content.blog.title}
          </h1>
          <p className="mt-2 text-sm text-slate-700 sm:text-base">
            {content.blog.description}
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
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
                  {content.blog.readMore}
                </Link>

                <Link
                  href="/#hero"
                  className="text-xs text-slate-500 hover:text-violet-700"
                >
                  {content.blog.backHome}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
