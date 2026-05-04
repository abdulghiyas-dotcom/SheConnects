"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Building2, User2 } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    howItWorks: "How it works",
    forOrgs: "For organisations",
    forWomen: "For Afghan women",
    impact: "Impact",
    signIn: "Sign in",
    getStarted: "Get started",
    iAmOrg: "I represent an organisation",
    iAmFreelancer: "I am a freelancer",
    orgDesc: "Sign in to your client account",
    freelancerDesc: "Sign in to your freelancer account",
  },
  it: {
    howItWorks: "Come funziona",
    forOrgs: "Per le organizzazioni",
    forWomen: "Per le donne afghane",
    impact: "Impatto",
    signIn: "Accedi",
    getStarted: "Inizia ora",
    iAmOrg: "Rappresento un'organizzazione",
    iAmFreelancer: "Sono un freelancer",
    orgDesc: "Accedi al tuo account cliente",
    freelancerDesc: "Accedi al tuo account freelancer",
  },
};

type Props = { language: Language; onLanguageChange: (lang: Language) => void };

export default function Header({ language, onLanguageChange }: Props) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const c = content[language];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSignInOpen(false);
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  const navLinks = [
    { href: "/#how-it-works", label: c.howItWorks },
    { href: "/#organizations", label: c.forOrgs },
    { href: "/#vas", label: c.forWomen },
    { href: "/#impact", label: c.impact },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-white/70 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/icon.png" alt="SheConnects" width={34} height={34} priority className="rounded-full" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">SheConnects</span>
              <span className="hidden sm:block text-[9px] text-slate-400 mt-0.5">
                {language === "it" ? "Lavoro digitale con impatto umano" : "Digital work with human impact"}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 hover:bg-indigo-50">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* Language toggle */}
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
              {(["en", "it"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all duration-150 ${
                    lang === language ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Sign in dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSignInOpen(!signInOpen)}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                {c.signIn}
                <ChevronDown size={13} className={`transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {signInOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/60"
                  >
                    <Link href="/app/sign-in?role=client" onClick={() => setSignInOpen(false)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-indigo-50 group transition-colors">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                        <Building2 size={14} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.iAmOrg}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.orgDesc}</p>
                      </div>
                    </Link>
                    <Link href="/app/sign-in?role=freelancer" onClick={() => setSignInOpen(false)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-purple-50 group transition-colors">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                        <User2 size={14} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.iAmFreelancer}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.freelancerDesc}</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/app/sign-up"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-md"
            >
              {c.getStarted}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 sm:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 sm:hidden flex flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
                <span className="font-bold text-slate-900">SheConnects</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-4 pt-6 space-y-1">
              {navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={l.href} className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-slate-100 px-4 py-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-400">Language:</span>
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                  {(["en", "it"] as Language[]).map((lang) => (
                    <button key={lang} type="button" onClick={() => onLanguageChange(lang)} className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-all ${lang === language ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/app/sign-in?role=client" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 transition-colors" onClick={() => setMobileOpen(false)}>
                <Building2 size={15} className="text-indigo-600" />{c.iAmOrg}
              </Link>
              <Link href="/app/sign-in?role=freelancer" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-purple-50 transition-colors" onClick={() => setMobileOpen(false)}>
                <User2 size={15} className="text-purple-600" />{c.iAmFreelancer}
              </Link>
              <Link href="/app/sign-up" className="block rounded-full bg-indigo-600 px-4 py-3.5 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>
                {c.getStarted}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
