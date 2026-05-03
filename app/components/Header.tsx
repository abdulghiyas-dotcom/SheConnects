"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Language, SiteContent } from "../lib/translations";
import { Menu, X } from "lucide-react";

type HeaderProps = {
  content: SiteContent["header"];
  language: Language;
  languageNames: Record<Language, string>;
  onLanguageChange: (lang: Language) => void;
};

const VISIBLE_NAV = ["/#how-it-works", "/#organizations", "/#vas", "/#impact", "/blog"];

export default function Header({
  content,
  language,
  languageNames,
  onLanguageChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = content.navItems.filter((n) => VISIBLE_NAV.includes(n.href));

  const navLabels: Record<string, string> = {};
  content.navItems.forEach((n) => { navLabels[n.href] = n.label; });

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-white/80 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/icon.png"
              alt="SheConnects logo"
              width={36}
              height={36}
              priority
              className="rounded-full"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                SheConnects
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                {language === "it" ? "Lavoro digitale con impatto umano" : "Digital work with human impact"}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {n.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* Lang toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(["en", "it"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all duration-150 ${
                    lang === language
                      ? "bg-white text-brand-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <Link
              href="/app/sign-in"
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {language === "it" ? "Accedi" : "Sign in"}
            </Link>

            <Link
              href="/app/sign-up"
              className="rounded-xl bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-700 hover:-translate-y-0.5"
            >
              {language === "it" ? "Inizia ora" : "Get started"}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 sm:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 sm:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 px-3 py-4">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 px-4 py-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500">Language:</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                  {(["en", "it"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => { onLanguageChange(lang); setOpen(false); }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase transition-all ${
                        lang === language ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/app/sign-in"
                className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {language === "it" ? "Accedi" : "Sign in"}
              </Link>
              <Link
                href="/app/sign-up"
                className="block w-full rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-brand"
                onClick={() => setOpen(false)}
              >
                {language === "it" ? "Inizia ora" : "Get started"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
