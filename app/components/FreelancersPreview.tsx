"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { freelancers } from "../lib/freelancers";
import { Language } from "../lib/translations";

type Props = { language: Language };

export default function FreelancersPreview({ language }: Props) {
  const preview = freelancers.slice(0, 3);

  return (
    <section id="freelancers" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {language === "it" ? "Incontra le nostre freelance" : "Meet our freelancers"}
            </h2>
          </div>
          {/* Fixed: Link points to the correct shared path */}
          <Link href="/freelancers" className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700">
            {language === "it" ? "Vedi tutto →" : "View all →"}
          </Link>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {preview.map((f) => (
          <article key={f.slug} className="rounded-2xl border border-violet-50 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{f.name}</h3>
            {/* Access bio through current language block */}
            <p className="mt-3 text-sm text-slate-700 line-clamp-4">{f[language].bio}</p>
            {/* Fixed: Profile link points to the correct shared path */}
            <Link href={`/freelancers/${f.slug}`} className="mt-4 inline-flex text-sm font-semibold text-violet-700">
              {language === "it" ? "Vedi profilo →" : "View profile →"}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
