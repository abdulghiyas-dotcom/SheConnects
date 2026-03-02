"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import {
  Language,
  SiteContent,
  defaultLanguage,
  translations,
} from "../lib/translations";

type AboutContentProps = {
  initialLanguage?: Language;
};

const coreValues = [
  {
    title: "Women First",
    description:
      "SheConnects is built around the economic empowerment of women. We prioritize their safety, dignity, growth, and long-term independence in every decision we make.",
    icon: "M12 3l7 4v5c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V7l7-4z",
  },
  {
    title: "Dignity Over Charity",
    description:
      "We do not provide aid — we create opportunity. Every contract is earned through skill, competence, and measurable performance.",
    icon: "M4 12h16M4 7h16M4 17h10",
  },
  {
    title: "Excellence Without Compromise",
    description:
      "Impact does not excuse mediocrity. We compete on quality, reliability, and professional standards at a global level.",
    icon: "M12 3l2.4 4.8L20 9l-4 3.9.9 5.6L12 16l-4.9 2.5.9-5.6L4 9l5.6-1.2L12 3z",
  },
  {
    title: "Transparency",
    description:
      "Our freelancers set their own rates. We operate with clear pricing, honest communication, and fair margins.",
    icon: "M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zm9-2.5A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5z",
  },
  {
    title: "Scalable Impact",
    description:
      "We design systems that grow sustainably — because meaningful change requires scale.",
    icon: "M4 16l5-5 4 4 7-7M20 8v5h-5",
  },
  {
    title: "Courage & Responsibility",
    description:
      "Operating in complex environments requires integrity and bold leadership. We protect our freelancers and honor our commitments to clients.",
    icon: "M12 4v8m0 0l3-3m-3 3l-3-3M5 20h14",
  },
  {
    title: "Inclusion Beyond Borders",
    description:
      "We begin with Afghan women — but our long-term vision is to empower excluded communities worldwide.",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-4-9h8",
  },
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

  return (
    <>
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />

      <section className="relative overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-8 h-52 w-52 rounded-full bg-violet-200/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-fuchsia-200/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="rounded-3xl border border-violet-100 bg-white/90 p-8 shadow-lg shadow-violet-100">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                  About
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  SheConnects
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Image
                  src="/icon.png"
                  alt="SheConnects logo"
                  width={76}
                  height={76}
                  className="rounded-2xl border border-violet-100"
                />
                <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                  Women-led · Impact-driven
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-semibold text-slate-900">Mission</h2>
                <div className="mt-3 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    SheConnects connects highly skilled Afghan women who have been excluded from the workforce to global clients seeking high-quality digital services.
                  </p>
                  <p>
                    We transform talent into opportunity — delivering exceptional digital work while enabling women to earn dignified, independent income.
                  </p>
                  <p>
                    We exist to rewrite the narrative: Afghan women are not defined by restriction, but by resilience, capability, and professionalism.
                  </p>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-semibold text-slate-900">Vision</h2>
                <p className="mt-3 text-sm text-slate-700 sm:text-base">
                  To become a globally recognized ethical outsourcing company — trusted for excellence, chosen for impact.
                </p>
                <p className="mt-4 text-sm font-semibold text-violet-700 sm:text-base">
                  We envision a world where:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 sm:text-base">
                  <li>• Talent matters more than geography or politics</li>
                  <li>• Afghan women are seen as global professionals</li>
                  <li>• Ethical outsourcing becomes a mainstream standard</li>
                  <li>• Excluded communities can compete and thrive in the global digital economy</li>
                </ul>
                <p className="mt-5 rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-900">
                  In 10 years, SheConnects will be the go-to global partner for impactful, high-quality project delivery.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-slate-900">Core Values</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {coreValues.map((value, index) => (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path d={value.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        {index + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
