"use client";

import { notFound } from "next/navigation";
import { freelancers } from "../../lib/freelancers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { translations, defaultLanguage, Language } from "../../lib/translations";
import { useState, useMemo } from "react";

type Props = { params: { slug: string } };

export default function FreelancerProfile({ params }: Props) {
  const [language, setLanguage] = useState<Language>("en");
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[language];

  // This line automatically picks the English or Italian text based on the toggle
  const localData = useMemo(() => freelancer ? freelancer[language] : null, [freelancer, language]);

  if (!freelancer || !localData) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      <section className="pt-28 pb-14 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {freelancer.categories.map((cat) => (
                <span key={cat} className="px-3 py-1 text-xs font-semibold bg-violet-50 text-violet-700 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {freelancer.name}
            </h1>
            <p className="mt-2 text-lg text-violet-600 font-medium">{localData.role}</p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {localData.bio}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 grid lg:grid-cols-[2fr,1fr] gap-14">
        <div className="space-y-12">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {language === "it" ? "Servizi" : "Services"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {localData.services.map((service) => (
                <span key={service} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {freelancer.portfolio.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {language === "it" ? "Esempi di lavoro" : "Work Samples"}
              </h2>
              <div className="space-y-3">
                {freelancer.portfolio.map((item) => (
                  <a key={item.link} href={item.link} className="block p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                      <span className="text-xs font-semibold text-violet-600">
                        {language === "it" ? "Vedi PDF →" : "View PDF →"}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-32 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-lg font-semibold mb-3">
              {language === "it" ? `Lavora con ${freelancer.name}` : `Work with ${freelancer.name}`}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {language === "it" 
                ? "Invia una richiesta di progetto e il nostro studio coordinerà ambito, tempi e consegna per garantire qualità e sicurezza."
                : "Submit a project request and our studio will coordinate scope, timeline, and delivery to ensure quality and security."}
            </p>
            <a href="/#contact" className="block w-full text-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white shadow-lg hover:opacity-95 transition">
              {language === "it" ? "Richiedi Collaborazione" : "Request Collaboration"}
            </a>
          </div>
        </aside>
      </section>
      <Footer content={content.footer} />
    </main>
  );
}
