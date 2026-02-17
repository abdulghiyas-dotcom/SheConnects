"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { freelancers } from "../lib/freelancers";
import { Language, translations } from "../lib/translations";

// We need to know the language to show the correct bio
type Props = {
  language: Language;
};

export default function FreelancersPreview({ language }: Props) {
  const preview = freelancers.slice(0, 3);
  const t = translations[language].header; // Using header translations for general UI if needed

  return (
    <section
      id="freelancers"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {language === "it" ? "Incontra le nostre freelance" : "Meet our freelancers"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">
              {language === "it" 
                ? "Professioniste afghane esperte che offrono programmazione, traduzione, supporto creativo, insegnamento online e ricerca — forniti attraverso un modello di studio gestito."
                : "Vetted Afghan women professionals offering programming, translation, creative support, online teaching, and research — delivered through a managed studio model."}
            </p>
          </div>

          <Link
            href="/freelancers"
            className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            {language === "it" ? "Vedi tutto →" : "View all →"}
          </Link>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {preview.map((f, i) => (
          <motion.article
            key={f.slug}
            className="rounded-2xl border border-violet-50 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm shadow-violet-100"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-lg font-semibold text-slate-900">{f.name}</h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {f.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 ring-1 ring-violet-100"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* FIX: Access the bio through the current language block */}
            <p className="mt-3 text-sm text-slate-700 line-clamp-4">
              {f[language].bio}
            </p>

            <Link
              href={`/freelancers/${f.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-800"
            >
              {language === "it" ? "Vedi profilo →" : "View profile →"}
            </Link>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/freelancers"
          className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          {language === "it" ? "Vedi tutto →" : "View all →"}
        </Link>
      </div>
    </section>
  );
}
