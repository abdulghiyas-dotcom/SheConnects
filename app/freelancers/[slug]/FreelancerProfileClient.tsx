"use client";

import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { freelancers } from "../../lib/freelancers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { defaultLanguage, translations, Language } from "../../lib/translations";
import { ShieldCheck, ExternalLink, ArrowRight, FileText } from "lucide-react";

type Props = {
  slug: string;
  initialLanguage?: Language;
};

const avatarColors = [
  "from-brand-400 to-brand-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
];

export default function FreelancerProfileClient({ slug, initialLanguage = defaultLanguage }: Props) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const freelancer = freelancers.find((f) => f.slug === slug);
  const content = translations[language];
  const freelancerIndex = freelancers.findIndex((f) => f.slug === slug);

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const localData = useMemo(() => freelancer ? freelancer[language] : null, [freelancer, language]);

  if (!freelancer || !localData) notFound();

  const avatarColor = avatarColors[freelancerIndex % avatarColors.length] ?? avatarColors[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header content={content.header} language={language} onLanguageChange={setLanguage} languageNames={content.languageNames} />

      {/* Profile hero */}
      <section
        className="relative overflow-hidden py-16"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-brand-600/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${avatarColor} text-3xl font-extrabold text-white shadow-brand-lg`}>
              {freelancer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">{freelancer.name}</h1>
                <ShieldCheck size={20} className="text-trust-400 flex-shrink-0" />
              </div>
              <p className="text-base text-brand-300 font-semibold">{localData.role}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-trust-500/30 bg-trust-500/20 px-3 py-1 text-[11px] font-semibold text-trust-300">
                <ShieldCheck size={11} />
                {language === "it" ? "Alias verificato — identità protetta da SheConnects" : "Verified alias — identity protected by SheConnects"}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            {/* Bio */}
            <motion.div
              className="rounded-2xl border border-slate-100 bg-white p-7 shadow-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {language === "it" ? "Chi sono" : "About"}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">{localData.bio}</p>

              <div className="mt-5 inline-flex items-start gap-3 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 mb-1">
                    {language === "it" ? "Lingue" : "Languages"}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{localData.languages}</p>
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              className="rounded-2xl border border-slate-100 bg-white p-7 shadow-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {language === "it" ? "Servizi" : "Services"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {localData.services.map((s) => (
                  <span key={s} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Portfolio */}
            {freelancer.portfolio.length > 0 && (
              <motion.div
                className="rounded-2xl border border-slate-100 bg-white p-7 shadow-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {language === "it" ? "Portfolio" : "Work samples"}
                </h2>
                <div className="space-y-3">
                  {freelancer.portfolio.map((item) => (
                    <a
                      key={item.link}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                          <FileText size={16} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.title[language]}</p>
                          <p className="text-xs text-slate-400">{item.description[language]}</p>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-slate-400 group-hover:text-brand-600 flex-shrink-0 ml-3" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside>
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-7 shadow-card text-center">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor} text-xl font-bold text-white shadow-sm`}>
                {freelancer.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {language === "it" ? `Lavora con ${freelancer.name}` : `Work with ${freelancer.name}`}
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                {language === "it"
                  ? "Registra un account gratuito per inviare un'offerta."
                  : "Create a free account to send an offer."}
              </p>
              <Link
                href="/app/sign-up"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-brand hover:bg-brand-700 transition-all hover:-translate-y-0.5"
              >
                {language === "it" ? "Invia offerta" : "Send offer"}
                <ArrowRight size={15} />
              </Link>
              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                {language === "it"
                  ? "Per tutelare la privacy, alcuni dati possono essere condivisi in forma protetta."
                  : "To protect privacy, some profile details may be shared in a protected form."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  );
}
