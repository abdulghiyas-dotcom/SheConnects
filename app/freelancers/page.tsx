"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { freelancers } from "../lib/freelancers";
import { translations, Language } from "../lib/translations";

export default function FreelancersPage() {
  const [language, setLanguage] = useState<Language>("en");
  const content = translations[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header content={content.header} language={language} onLanguageChange={setLanguage} languageNames={content.languageNames} />
      <section className="pt-28 pb-16 bg-white border-b border-slate-100 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          {language === "it" ? "Incontra le nostre freelance" : "Meet Our Freelancers"}
        </h1>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {freelancers.map((f) => (
          <div key={f.slug} className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">{f.name}</h3>
            <p className="text-sm text-slate-600 line-clamp-4">{f[language].bio}</p>
            <Link href={`/freelancers/${f.slug}`} className="mt-8 inline-block rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white">
              {language === "it" ? "Vedi Profilo" : "View Profile"}
            </Link>
          </div>
        ))}
      </section>
      <Footer content={content.footer} />
    </main>
  );
}
