import type { Metadata } from "next";
import { blogPosts } from "./posts";
import BlogContent from "../components/BlogContent";
import { getPreferredLanguage } from "../lib/language";

export const metadata: Metadata = {
  title: "Blog – SheConnects",
  description:
    "Stories, insights, and updates from SheConnects – a remote service studio powered by Afghan women.",
};

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const initialLanguage = getPreferredLanguage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <BlogContent initialLanguage={initialLanguage} posts={sortedPosts} />
    </main>
  );
}
