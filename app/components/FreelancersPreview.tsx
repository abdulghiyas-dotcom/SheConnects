"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { freelancers } from "../lib/freelancers";
import { Language } from "../lib/translations";

type Props = { language: Language };

export default function FreelancersPreview({ language }: Props) {
  const preview = freelancers.slice(0, 3);

  return (
    <section id="freelancers" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6 shadow-[0_18px_55px_-32px_rgba(109,40,217,0.8)] sm:p-8"
      >
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
              {language === "it" ? "Talenti in evidenza" : "Featured talent"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {language === "it" ? "Incontra le nostre freelance" : "Meet our freelancers"}
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              {language === "it"
                ? "Scopri professioniste selezionate in programmazione, design, traduzione e ricerca pronte a supportare il tuo prossimo progetto."
                : "Discover standout professionals in programming, design, translation, and research ready to support your next project."}
            </p>
          </div>

          <Link
            href="/freelancers"
            className="inline-flex w-fit items-center rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            {language === "it" ? "Vedi tutte le freelance →" : "View all freelancers →"}
          </Link>
        </div>

        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          {preview.map((f) => (
            <article
              key={f.slug}
              className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-slate-900">{f.name}</h3>
              <p className="mt-3 text-sm text-slate-700 line-clamp-4">{f[language].bio}</p>
              <Link
                href={`/freelancers/${f.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-violet-700"
              >
                {language === "it" ? "Vedi profilo →" : "View profile →"}
              </Link>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
