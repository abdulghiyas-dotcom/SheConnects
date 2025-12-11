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

  const navItems = content.navItems;

  const languageButtons = (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] shadow-sm">
      {(["en", "it"] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onLanguageChange(lang)}
          className={`rounded-full px-2 py-0.5 leading-none transition-colors ${
            language === lang
              ? "bg-violet-600 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {languageNames[lang]}
        </button>
      ))}
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
<<<<<<< HEAD
            width={40}
            height={40}
=======
            width={44}
            height={44}
>>>>>>> 0d6259a454b7e7b7910fda91dbc6dc3d30c6fc11
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
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? content.close : content.menu}
        </button>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 text-sm text-slate-700 sm:flex">
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
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            {content.cta}
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">
              {content.languageLabel}
            </span>
            {languageButtons}
          </div>
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
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}

            <Link
              href="/#contact"
              className="mt-2 inline-block w-full rounded-full bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white shadow-md shadow-violet-200"
              onClick={() => setOpen(false)}
            >
              {content.cta}
            </Link>

            <div className="pt-2">
              <p className="mb-1 text-[11px] text-slate-500">
                {content.languageLabel}
              </p>
              {languageButtons}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
