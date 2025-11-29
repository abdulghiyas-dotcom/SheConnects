"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#impact", label: "Impact" },
    { href: "#organizations", label: "For organizations" },
    { href: "#vas", label: "For Afghan women" },
    { href: "#testimonials", label: "Stories" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 text-slate-800 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <Link href="#hero" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white shadow-sm">
            SC
          </span>
          <span className="text-sm font-semibold">SheConnects</span>
        </Link>

        <button
          className="sm:hidden rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 shadow-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <div className="hidden gap-6 text-sm text-slate-700 sm:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="transition-colors hover:text-violet-700"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            Talk to our team
          </a>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <div className="px-4 py-3">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="block py-1 text-sm text-slate-700"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-block w-full rounded-full bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white shadow-md shadow-violet-200"
              onClick={() => setOpen(false)}
            >
              Talk to our team
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
