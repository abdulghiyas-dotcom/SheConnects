"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { freelancers } from "../lib/freelancers";
import { Language } from "../lib/translations";
import { ShieldCheck, ArrowRight } from "lucide-react";

type Props = { language: Language };

const avatarColors = [
  "from-brand-400 to-brand-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
];

export default function FreelancersPreview({ language }: Props) {
  const preview = freelancers.slice(0, 3);

  return (
    <section id="freelancers" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 mb-3">
            {language === "it" ? "Talenti in evidenza" : "Featured talent"}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {language === "it" ? "Incontra le nostre freelance" : "Meet our freelancers"}
          </h2>
          <p className="mt-2 text-base text-slate-500 max-w-xl">
            {language === "it"
              ? "Professioniste selezionate in programmazione, design, traduzione e ricerca."
              : "Verified professionals in programming, design, translation, and research."}
          </p>
        </div>
        <Link
          href="/freelancers"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-card"
        >
          {language === "it" ? "Vedi tutte" : "View all"}
          <ArrowRight size={15} />
        </Link>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {preview.map((f, index) => (
          <motion.article
            key={f.slug}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColors[index]} text-white font-bold text-lg shadow-sm`}>
                {f.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-trust-100 bg-trust-50 px-2 py-0.5 text-[11px] font-medium text-trust-700">
                <ShieldCheck size={11} />
                {language === "it" ? "Alias verificato" : "Verified alias"}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{f[language].role}</p>
            <p className="mt-3 text-sm text-slate-600 line-clamp-3">{f[language].bio}</p>

            <Link
              href={`/freelancers/${f.slug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              {language === "it" ? "Vedi profilo" : "View profile"}
              <ArrowRight size={14} />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
