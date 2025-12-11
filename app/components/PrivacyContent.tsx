"use client";

import { useEffect, useMemo, useState } from "react";
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

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-14">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-10 -top-8 h-32 w-32 rounded-full bg-violet-200 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-fuchsia-200 blur-3xl" />
        </div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            {content.privacy.title}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {content.privacy.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-700 sm:text-base">
            {content.privacy.intro}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {content.privacy.effectiveLabel} {content.privacy.effectiveDate}
          </p>
        </div>

        <div className="relative mt-10 space-y-8">
          {content.privacy.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-2 text-sm text-slate-700">{section.description}</p>
              )}

              {section.items && Array.isArray(section.items) && (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {section.items.map((item, index) => {
                    if (typeof item === "string") {
                      return <li key={index}>• {item}</li>;
                    }

                    return (
                      <li key={item.content}>
                        <span className="font-semibold text-slate-900">
                          {item.label}
                        </span>
                        {": "}
                        {item.content}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="relative mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-700">
          {content.privacy.contact}
        </div>
      </div>

      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
