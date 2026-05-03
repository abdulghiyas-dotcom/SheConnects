"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { freelancers } from "../lib/freelancers";
import { defaultLanguage, translations, Language } from "../lib/translations";
import { ShieldCheck, ArrowRight, Search } from "lucide-react";

type Props = {
  initialLanguage?: Language;
};

const avatarColors = [
  "from-brand-400 to-brand-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
];

export default function FreelancersPageClient({ initialLanguage = defaultLanguage }: Props) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [search, setSearch] = useState("");
  const content = translations[language];
  const [activeFilter, setActiveFilter] = useState<string>(language === "it" ? "Tutto" : "All");

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const categories = useMemo(() => {
    const allCategories = freelancers.flatMap((f) => f.categories[language]);
    const unique = Array.from(new Set(allCategories));
    return [language === "it" ? "Tutto" : "All", ...unique];
  }, [language]);

  const filteredFreelancers = useMemo(() => {
    const allLabel = language === "it" ? "Tutto" : "All";
    let result = freelancers;
    if (activeFilter !== allLabel && categories.includes(activeFilter)) {
      result = result.filter((f) => f.categories[language].includes(activeFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f[language].bio.toLowerCase().includes(q) ||
          f[language].services.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeFilter, categories, language, search]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        content={content.header}
        language={language}
        onLanguageChange={(newLanguage) => {
          setLanguage(newLanguage);
          setActiveFilter(newLanguage === "it" ? "Tutto" : "All");
        }}
        languageNames={content.languageNames}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-5">
              {language === "it" ? "Talenti verificati" : "Verified talent"}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {language === "it" ? "Incontra le nostre freelance" : "Meet Our Freelancers"}
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              {language === "it"
                ? "Una rete curata di professioniste afghane verificate."
                : "A curated network of verified Afghan women professionals."}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mt-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === "it" ? "Cerca per nome o competenza…" : "Search by name or skill…"}
                className="w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? "bg-brand-600 text-white shadow-brand"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredFreelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700">No freelancers found</h3>
            <p className="mt-1 text-sm text-slate-400">Try different search terms or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFreelancers.map((f, index) => (
              <motion.div
                key={f.slug}
                className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} text-white font-bold text-lg shadow-sm`}>
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-trust-100 bg-trust-50 px-2 py-0.5 text-[11px] font-medium text-trust-700">
                    <ShieldCheck size={11} />
                    {language === "it" ? "Alias verificato" : "Verified"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{f[language].role}</p>
                <p className="mt-3 flex-1 text-sm text-slate-600 line-clamp-3">{f[language].bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f[language].services.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                  <Link
                    href={`/freelancers/${f.slug}`}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {language === "it" ? "Vedi profilo" : "View profile"}
                  </Link>
                  <Link
                    href={`/app/sign-up`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-brand hover:bg-brand-700 transition-colors"
                  >
                    {language === "it" ? "Invia offerta" : "Send offer"}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-slate-400">
          {language === "it"
            ? "Stiamo ampliando il network: nuove freelance in arrivo presto."
            : "We are expanding our network: more freelancers coming soon."}
        </p>
      </section>

      <Footer content={content.footer} />
    </main>
  );
}
