"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import {
  Language,
  SiteContent,
  defaultLanguage,
  translations,
} from "../lib/translations";

function normalizeLanguage(value: Language | string | undefined): Language {
  return value === "it" ? "it" : "en";
}

type PrivacyContentProps = {
  initialLanguage?: Language;
};

export default function PrivacyContent({
  initialLanguage = defaultLanguage,
}: PrivacyContentProps) {
  const [language, setLanguage] = useState<Language>(
    normalizeLanguage(initialLanguage)
  );

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const content: SiteContent = useMemo(() => translations[language], [language]);

  return (
    <>
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      {/* Header section */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700 mb-4">
              Legal
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {content.privacy.title}
            </h1>
            <p className="mt-3 text-base text-slate-500 leading-relaxed max-w-2xl">
              {content.privacy.intro}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {content.privacy.effectiveLabel} <span className="font-medium text-slate-600">{content.privacy.effectiveDate}</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 pb-20">
        <div className="space-y-5">
          {content.privacy.sections.map((section, i) => (
            <motion.section
              key={section.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>

              {section.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.description}</p>
              )}

              {section.items && Array.isArray(section.items) && (
                <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                  {section.items.map((item, index) => {
                    if (typeof item === "string") {
                      return (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                          {item}
                        </li>
                      );
                    }
                    return (
                      <li key={item.content} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                        <span>
                          <span className="font-semibold text-slate-800">{item.label}:</span>{" "}
                          {item.content}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 text-sm text-slate-600 leading-relaxed">
          {content.privacy.contact}
        </div>
      </div>

      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
