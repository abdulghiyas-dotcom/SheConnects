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
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <Link href="#hero" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-sm font-semibold">
            SC
          </span>
          <span className="text-sm font-semibold">SheConnects</span>
        </Link>

        <button
          className="sm:hidden rounded border border-slate-700 px-2 py-1 text-xs"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <div className="hidden sm:flex gap-6 text-sm text-slate-200">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="hover:text-violet-300 transition-colors"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-violet-500/40"
          >
            Talk to our team
          </a>
        </div>
      </nav>

      {open && (
        <div className="bg-slate-950 border-t border-slate-800 sm:hidden">
          <div className="px-4 py-3">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="block py-1 text-sm text-slate-200"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-block w-full rounded-full bg-violet-500 px-4 py-2 text-center text-sm font-medium text-slate-950"
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
