"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { freelancers } from "../lib/freelancers";
import { translations, Language } from "../lib/translations";

export default function FreelancersPage() {
  // Listen to the global language state
  const [language, setLanguage] = useState<Language>("en");
  const content = translations[language];
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Dynamically extract categories from freelancers data
  const categories = useMemo(() => {
    const allCategories = freelancers.flatMap((f) => f.categories);
    const unique = Array.from(new Set(allCategories));
    return ["All", ...unique];
  }, []);

  const filteredFreelancers = useMemo(() => {
    if (activeFilter === "All") return freelancers;
    return freelancers.filter((f) =>
      f.categories.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      {/* HERO */}
      <section className="pt-28 pb-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            {language === "it" ? "Incontra le nostre freelance" : "Meet Our Freelancers"}
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            {language === "it" 
              ? "Una rete curata di professioniste afghane che offrono servizi remoti di alta qualità attraverso SheConnects."
              : "A curated network of Afghan women professionals delivering high-quality remote services through SheConnects."}
          </p>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        
        {/* Filter Bar */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 text-xs font-semibold rounded-full transition ${
                activeFilter === cat
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300"
              }`}
            >
              {cat === "All" && language === "it" ? "Tutto" : cat}
            </button>
          ))}
        </div>

        {/* Freelancer Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFreelancers.map((f) => (
            <div
              key={f.slug}
              className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {f.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 text-xs font-semibold bg-violet-50 text-violet-700 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold tracking-tight mb-3">
                {f.name}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                {/* Switch bio based on language state */}
                {f[language].bio}
              </p>

              <Link
                href={`/freelancers/${f.slug}`}
                className="mt-8 inline-block rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:opacity-95 transition"
              >
                {language === "it" ? "Vedi Profilo" : "View Profile"}
              </Link>
            </div>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center mt-16 text-slate-500">
            {language === "it" ? "Nessuna freelance disponibile in questa categoria." : "No freelancers available in this category."}
          </div>
        )}
      </section>

      <Footer content={content.footer} />
    </main>
  );
}
