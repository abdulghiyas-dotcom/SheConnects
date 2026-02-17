"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { freelancers } from "../../lib/freelancers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { translations, Language } from "../../lib/translations";

type Props = { params: { slug: string } };

export default function FreelancerProfile({ params }: Props) {
  const [language, setLanguage] = useState<Language>("en");
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[language];

  if (!freelancer) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header content={content.header} language={language} onLanguageChange={setLanguage} languageNames={content.languageNames} />
      <section className="pt-28 pb-14 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{freelancer.name}</h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">{freelancer[language].bio}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14 grid lg:grid-cols-[2fr,1fr] gap-14">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">{language === "it" ? "Servizi" : "Services"}</h2>
          <div className="flex flex-wrap gap-3">
            {freelancer[language].services.map((s) => (
              <span key={s} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700">{s}</span>
            ))}
          </div>
        </div>
        <aside>
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">{language === "it" ? `Lavora con ${freelancer.name}` : `Work with ${freelancer.name}`}</h3>
            <a href="/#contact" className="block w-full text-center rounded-full bg-violet-600 py-3 text-sm font-medium text-white">
              {language === "it" ? "Richiedi Collaborazione" : "Request Collaboration"}
            </a>
          </div>
        </aside>
      </section>
      <Footer content={content.footer} />
    </main>
  );
}
