"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Building2, User2 } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    tagline: "Digital work with human impact",
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
    tagline: "Lavoro digitale con impatto umano",
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

type Props = {
  language: Language;
  onLanguageChange: (lang: Language) => void;
};

export default function DarkHeader({ language, onLanguageChange }: Props) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const c = content[language];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
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
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#080810]/85 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/icon.png"
              alt="SheConnects"
              width={34}
              height={34}
              priority
              className="rounded-full"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                SheConnects
              </span>
              <span className="hidden sm:block text-[9px] text-white/35 mt-0.5">
                {c.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-1.5 text-sm text-white/55 transition-colors hover:text-white hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden items-center gap-2.5 sm:flex">
            {/* Language toggle */}
            <div className="flex items-center rounded-full border border-white/12 bg-white/5 p-0.5">
              {(["en", "it"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all duration-150 ${
                    lang === language
                      ? "bg-white/15 text-white"
                      : "text-white/35 hover:text-white/60"
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
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-white/60 transition-all hover:text-white hover:bg-white/5"
              >
                {c.signIn}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {signInOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-68 rounded-2xl border border-white/10 bg-[#0F0F1A] p-1.5 shadow-2xl shadow-black/50"
                    style={{ width: "270px" }}
                  >
                    <Link
                      href="/app/sign-in?role=client"
                      onClick={() => setSignInOpen(false)}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5 group"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 group-hover:bg-indigo-500/25 transition-colors">
                        <Building2 size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.iAmOrg}</p>
                        <p className="text-xs text-white/35 mt-0.5">{c.orgDesc}</p>
                      </div>
                    </Link>
                    <Link
                      href="/app/sign-in?role=freelancer"
                      onClick={() => setSignInOpen(false)}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5 group"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/15 group-hover:bg-purple-500/25 transition-colors">
                        <User2 size={14} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.iAmFreelancer}</p>
                        <p className="text-xs text-white/35 mt-0.5">{c.freelancerDesc}</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/app/sign-up"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-neon"
              style={{ boxShadow: "0 0 20px rgba(79,70,229,0.3)" }}
            >
              {c.getStarted}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 text-white/70 hover:text-white sm:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 sm:hidden flex flex-col"
            style={{ background: "#080810" }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
                <span className="font-bold text-white">SheConnects</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 text-white/70"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 pt-6 space-y-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-white/8 px-4 py-6 space-y-3">
              {/* Language toggle */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/35">Language:</span>
                <div className="flex items-center rounded-full border border-white/12 bg-white/5 p-0.5">
                  {(["en", "it"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onLanguageChange(lang)}
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                        lang === language ? "bg-white/15 text-white" : "text-white/35"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/app/sign-in?role=client"
                className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Building2 size={15} className="text-indigo-400" />
                {c.iAmOrg}
              </Link>
              <Link
                href="/app/sign-in?role=freelancer"
                className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User2 size={15} className="text-purple-400" />
                {c.iAmFreelancer}
              </Link>
              <Link
                href="/app/sign-up"
                className="block rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3.5 text-center text-sm font-semibold text-white"
                style={{ boxShadow: "0 0 20px rgba(79,70,229,0.35)" }}
                onClick={() => setMobileOpen(false)}
              >
                {c.getStarted}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
