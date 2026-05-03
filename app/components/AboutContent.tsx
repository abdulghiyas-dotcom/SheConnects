"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import { motion } from "framer-motion";
import {
  Language,
  SiteContent,
  defaultLanguage,
  translations,
} from "../lib/translations";

type AboutContentProps = {
  initialLanguage?: Language;
};

const valueIcons = [
  "M12 3l7 4v5c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V7l7-4z",
  "M4 12h16M4 7h16M4 17h10",
  "M12 3l2.4 4.8L20 9l-4 3.9.9 5.6L12 16l-4.9 2.5.9-5.6L4 9l5.6-1.2L12 3z",
  "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zm9-2.5A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5z",
  "M4 16l5-5 4 4 7-7M20 8v5h-5",
  "M12 4v8m0 0l3-3m-3 3l-3-3M5 20h14",
];

const team = [
  { name: "Abdul Kamyar", role: "CEO & Co-founder", initials: "AK", color: "from-brand-400 to-brand-600" },
  { name: "Sediqa Sharifi", role: "CCO & Co-founder", initials: "SS", color: "from-violet-400 to-violet-600" },
];

export default function AboutContent({
  initialLanguage = defaultLanguage,
}: AboutContentProps) {
  const [language, setLanguage] = useState<Language>(
    initialLanguage === "it" ? "it" : "en"
  );

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const content: SiteContent = useMemo(() => translations[language], [language]);
  const about = content.about;

  return (
    <>
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image src="/icon.png" alt="SheConnects" width={72} height={72} className="rounded-2xl mb-5 shadow-brand" />
            <span className="mb-3 inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-300">
              {about.badge}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {about.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300 leading-relaxed">
              {about.label}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.article
            className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700 mb-4">
              {about.missionTitle}
            </span>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              {about.missionParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-violet-700 mb-4">
              {about.visionTitle}
            </span>
            <p className="text-base text-slate-600 leading-relaxed">{about.visionIntro}</p>
            <p className="mt-4 text-sm font-bold text-slate-800">{about.visionWorldLabel}</p>
            <ul className="mt-3 space-y-2">
              {about.visionBullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-sm font-medium text-brand-800">
              {about.visionClosing}
            </p>
          </motion.article>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
              Team
            </span>
            <h2 className="text-3xl font-bold text-slate-900">The people behind SheConnects</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-2xl font-bold text-white shadow-sm`}>
                  {member.initials}
                </div>
                <p className="text-lg font-bold text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-500 mt-1">{member.role}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-trust-50 border border-trust-100 px-3 py-1 text-[11px] font-semibold text-trust-700">
                  Milan, Italy
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-700 mb-4">
            Values
          </span>
          <h2 className="text-3xl font-bold text-slate-900">{about.valuesTitle}</h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {about.coreValues.map((value, index) => (
            <motion.article
              key={value.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d={valueIcons[index] ?? valueIcons[valueIcons.length - 1]} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{index + 1}</p>
                  <h3 className="text-base font-bold text-slate-900">{value.title}</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{value.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
