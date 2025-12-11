"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Language, SiteContent } from "../lib/translations";

type HeaderProps = {
  content: SiteContent["header"];
  language: Language;
  languageNames: Record<Language, string>;
  onLanguageChange: (lang: Language) => void;
};

export default function Header({
  content,
  language,
  languageNames,
  onLanguageChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Remove Services / Servizi to save space
  const navItems = content.navItems.filter(
    (n) => n.href !== "#services" && n.href !== "/#services"
  );

  const languageOptions: Language[] = ["en", "it"];

  const languageSwitcher = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setLangOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        {languageNames[language]}
        <span className="text-[9px] text-slate-500">▾</span>
      </button>

      {langOpen && (
        <div className="absolute right-0 z-50 mt-1 w-24 rounded-2xl border border-slate-200 bg-white py-1 text-[11px] shadow-lg">
          {languageOptions.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                onLanguageChange(lang);
                setLangOpen(false);
              }}
              className={`block w-full px-3 py-1 text-left ${
                lang === language
                  ? "bg-violet-50 font-semibold text-violet-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 text-slate-800 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2"
        aria-label="Main navigation"
      >
        {/* Logo + brand + slogan */}
        <Link href="/#hero" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="SheConnects logo"
            width={40}
            height={40}
            priority
            className="rounded-full"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              {content.brand}
            </span>
            <span className="text-[10px] font-medium text-slate-500 -mt-0.5">
              {content.tagline}
            </span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="sm:hidden rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 shadow-sm"
          onClick={() => {
            setOpen(!open);
            setLangOpen(false);
          }}
          aria-label="Toggle navigation menu"
        >
          {open ? content.close : content.menu}
        </button>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 text-sm text-slate-700 sm:flex">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="transition-colors hover:text-violet-700"
            >
              {n.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            {content.cta}
          </Link>

          {/* Language button (label removed) */}
          {languageSwitcher}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <div className="space-y-2 px-4 py-3">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block py-1 text-sm text-slate-700"
                onClick={() => {
                  setOpen(false);
                  setLangOpen(false);
                }}
              >
                {n.label}
              </Link>
            ))}

            <Link
              href="/#contact"
              className="mt-2 inline-block w-full rounded-full bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white shadow-md shadow-violet-200"
              onClick={() => {
                setOpen(false);
                setLangOpen(false);
              }}
            >
              {content.cta}
            </Link>

            {/* Language dropdown also used in mobile */}
            <div className="pt-2">{languageSwitcher}</div>
          </div>
        </div>
      )}
    </header>
  );
}
