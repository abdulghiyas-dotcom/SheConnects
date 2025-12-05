"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#impact", label: "Impact" },
    { href: "#organizations", label: "For organizations" },
    { href: "#vas", label: "For Afghan women" },
    { href: "#testimonials", label: "Stories" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        {/* Logo + brand */}
        <Link href="#hero" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="SheConnects logo"
            width={36}
            height={36}
            priority
            className="rounded-full"
          />
          <span className="text-sm font-semibold tracking-tight">
            SheConnects
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="sm:hidden rounded border border-slate-700 px-2 py-1 text-xs text-slate-200"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex gap-6 text-sm text-slate-200">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-violet-300 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-violet-500/40 hover:bg-violet-400 transition"
          >
            Talk to our team
          </a>
        </div>
      </nav>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="sm:hidden bg-slate-950 border-t border-slate-800">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-200 py-1"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              className="mt-2 w-full rounded-full bg-violet-500 px-4 py-2 text-center text-sm font-semibold text-slate-950"
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

