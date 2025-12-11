"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/#services", label: "Services" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#impact", label: "Impact" },
    { href: "/#organizations", label: "For organizations" },
    { href: "/#vas", label: "For Afghan women" },

    // REMOVED STORIES
    // { href: "/#testimonials", label: "Stories" },

    // 🔥 NEW ITEMS
    { href: "/blog", label: "Blog" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 text-slate-800 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        {/* Logo + brand + slogan */}
        <Link href="/#hero" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="SheConnects logo"
            width={48}
            height={48}
            priority
            className="rounded-full"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              SheConnects
            </span>

            <span className="text-[10px] font-medium text-slate-500 -mt-0.5">
              Digital work with human impact.
            </span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="sm:hidden rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 shadow-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        {/* Desktop navigation */}
        <div className="hidden gap-6 text-sm text-slate-700 sm:flex">
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
            Talk to our team
          </Link>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <div className="px-4 py-3">
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
              Talk to our team
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
