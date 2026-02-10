"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { freelancers } from "../lib/freelancers";
import { translations, defaultLanguage } from "../lib/translations";

export default function FreelancersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const content = translations[defaultLanguage];

  // This creates the list of categories based on your request
  const categories = [
    "All",
    "Programming",
    "Graphic Design",
    "Teaching Online",
    "Market Research",
    "Document Translation",
  ];

  const filteredFreelancers = useMemo(() => {
    if (activeFilter === "All") return freelancers;
    return freelancers.filter((f) => f.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        content={content.header}
        language="en"
        onLanguageChange={() => {}}
        languageNames={content.languageNames}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Our Expert Freelancers
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Discover talented professional women offering specialized digital services.
          </p>
        </div>

        {/* Modern Filter Bar */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                activeFilter === cat
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Freelancer Grid */}
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredFreelancers.map((f) => (
              <motion.div
                key={f.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group rounded-3xl border border-violet-100 bg-white p-3 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={`/freelancers/${f.slug}.jpg`}
                    alt={f.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900">{f.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                    {f.categories.join(" • ")}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {f.bio}
                  </p>
                  <Link
                    href={`/freelancers/${f.slug}`}
                    className="mt-6 block w-full rounded-2xl bg-slate-900 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-violet-700"
                  >
                    View Full Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <Footer content={content.footer} />
    </main>
  );
}
