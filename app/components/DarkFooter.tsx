"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: {
    tagline: "Digital work with human impact.",
    desc: "Connecting Afghan women professionals with European organisations since 2023.",
    platform: "Platform",
    company: "Company",
    freelancer: "For freelancers",
    legal: "Legal",
    platformLinks: [
      { href: "/app/sign-up",   label: "Get started" },
      { href: "/app/sign-in",   label: "Sign in" },
      { href: "/freelancers",   label: "Browse freelancers" },
    ],
    companyLinks: [
      { href: "/about",         label: "About us" },
      { href: "/blog",          label: "Blog" },
      { href: "mailto:hello@sheconnects.work", label: "hello@sheconnects.work" },
    ],
    freelancerLinks: [
      { href: "/app/apply",     label: "Apply as a freelancer" },
      { href: "/#how-it-works", label: "How it works for you" },
      { href: "/#impact",       label: "Our impact" },
    ],
    legalLinks: [
      { href: "/privacy",       label: "Privacy policy" },
      { href: "/privacy",       label: "Cookie policy" },
    ],
    copyright: "SheConnects SRL · P. IVA 14470870966 · Milan, Italy",
  },
  it: {
    tagline: "Lavoro digitale con impatto umano.",
    desc: "Connettiamo professioniste afghane con organizzazioni europee dal 2023.",
    platform: "Piattaforma",
    company: "Azienda",
    freelancer: "Per i freelancer",
    legal: "Legale",
    platformLinks: [
      { href: "/app/sign-up",   label: "Inizia ora" },
      { href: "/app/sign-in",   label: "Accedi" },
      { href: "/freelancers",   label: "Sfoglia freelancer" },
    ],
    companyLinks: [
      { href: "/about",         label: "Chi siamo" },
      { href: "/blog",          label: "Blog" },
      { href: "mailto:hello@sheconnects.work", label: "hello@sheconnects.work" },
    ],
    freelancerLinks: [
      { href: "/app/apply",     label: "Candidati come freelancer" },
      { href: "/#how-it-works", label: "Come funziona per te" },
      { href: "/#impact",       label: "Il nostro impatto" },
    ],
    legalLinks: [
      { href: "/privacy",       label: "Privacy policy" },
      { href: "/privacy",       label: "Cookie policy" },
    ],
    copyright: "SheConnects SRL · P. IVA 14470870966 · Milano, Italia",
  },
};

type Props = { language: Language };

export default function Footer({ language }: Props) {
  const c = content[language];
  const year = new Date().getFullYear();

  const cols = [
    { label: c.platform,   links: c.platformLinks   },
    { label: c.company,    links: c.companyLinks     },
    { label: c.freelancer, links: c.freelancerLinks  },
    { label: c.legal,      links: c.legalLinks       },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-slate-100" style={{ background: "linear-gradient(160deg, #ffffff 0%, #F5F3FF 60%, #EEF2FF 100%)" }}>
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-20 -right-20 rounded-full"
        style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-16 left-1/3 rounded-full"
        style={{ width: 240, height: 240, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-5">
              <Image src="/icon.png" alt="SheConnects" width={40} height={40} className="rounded-full shadow-sm" />
              <div>
                <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">SheConnects SRL</p>
                <p className="text-[10px] text-slate-400 mt-0.5">P. IVA 14470870966</p>
              </div>
            </Link>

            <p className="max-w-xs text-sm font-semibold leading-snug text-indigo-600 mb-2">{c.tagline}</p>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">{c.desc}</p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://www.linkedin.com/company/sheconnects-work"
                target="_blank" rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-md"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.55V24H.22V8.53zM8.67 8.53h4.37v2.11h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.49 3.05 5.49 7.02V24h-4.55v-7.86c0-1.88-.03-4.29-2.62-4.29-2.63 0-3.03 2.05-3.03 4.15V24H8.67V8.53z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/sheconnects.work"
                target="_blank" rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-pink-300 hover:bg-pink-50 hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 text-slate-400 group-hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 9.5zm4.75-3.75a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/SheConnects/61579434964386/"
                target="_blank" rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326V22.67c0 .733.593 1.326 1.325 1.326h11.495v-9.835H9.691v-3.83h3.129V7.548c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.313h3.587l-.467 3.83h-3.12V24h6.117c.73 0 1.323-.593 1.323-1.326V1.326C24 .593 23.405 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.label}>
              <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{col.label}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 transition-colors hover:text-indigo-600 hover:font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-slate-200/60 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[11px] text-slate-400">© {year} {c.copyright}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <p className="text-[11px] font-medium text-indigo-500">Digital work with human impact</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
