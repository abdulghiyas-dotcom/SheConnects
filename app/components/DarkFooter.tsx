import Image from "next/image";
import Link from "next/link";

type Language = "en" | "it";

const content = {
  en: {
    tagline: "Digital work with human impact.",
    platform: "Platform",
    company: "Company",
    freelancer: "For freelancers",
    legal: "Legal",
    platformLinks: [
      { href: "/app/sign-up",    label: "Get started" },
      { href: "/app/sign-in",    label: "Sign in" },
      { href: "/freelancers",    label: "Browse freelancers" },
    ],
    companyLinks: [
      { href: "/about",          label: "About us" },
      { href: "/blog",           label: "Blog" },
      { href: "mailto:hello@sheconnects.work", label: "hello@sheconnects.work" },
    ],
    freelancerLinks: [
      { href: "/app/apply",      label: "Apply as a freelancer" },
      { href: "/#how-it-works",  label: "How it works for you" },
      { href: "/#impact",        label: "Our impact" },
    ],
    legalLinks: [
      { href: "/privacy",        label: "Privacy policy" },
      { href: "/privacy",        label: "Cookie policy" },
    ],
    copyright: "SheConnects SRL · P. IVA 14470870966 · Milan, Italy",
  },
  it: {
    tagline: "Lavoro digitale con impatto umano.",
    platform: "Piattaforma",
    company: "Azienda",
    freelancer: "Per i freelancer",
    legal: "Legale",
    platformLinks: [
      { href: "/app/sign-up",    label: "Inizia ora" },
      { href: "/app/sign-in",    label: "Accedi" },
      { href: "/freelancers",    label: "Sfoglia freelancer" },
    ],
    companyLinks: [
      { href: "/about",          label: "Chi siamo" },
      { href: "/blog",           label: "Blog" },
      { href: "mailto:hello@sheconnects.work", label: "hello@sheconnects.work" },
    ],
    freelancerLinks: [
      { href: "/app/apply",      label: "Candidati come freelancer" },
      { href: "/#how-it-works",  label: "Come funziona per te" },
      { href: "/#impact",        label: "Il nostro impatto" },
    ],
    legalLinks: [
      { href: "/privacy",        label: "Privacy policy" },
      { href: "/privacy",        label: "Cookie policy" },
    ],
    copyright: "SheConnects SRL · P. IVA 14470870966 · Milano, Italia",
  },
};

type Props = { language: Language };

export default function Footer({ language }: Props) {
  const c = content[language];
  const year = new Date().getFullYear();

  const cols = [
    { label: c.platform,    links: c.platformLinks    },
    { label: c.company,     links: c.companyLinks     },
    { label: c.freelancer,  links: c.freelancerLinks  },
    { label: c.legal,       links: c.legalLinks       },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-5">
              <Image src="/icon.png" alt="SheConnects" width={38} height={38} className="rounded-full" />
              <div>
                <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">SheConnects SRL</p>
                <p className="text-[10px] text-slate-500 mt-0.5">P. IVA 14470870966</p>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">{c.tagline}</p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
              <a href="https://www.linkedin.com/company/sheconnects-work" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-500 transition-all hover:border-indigo-500 hover:text-white hover:bg-indigo-600/20" aria-label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.55V24H.22V8.53zM8.67 8.53h4.37v2.11h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.49 3.05 5.49 7.02V24h-4.55v-7.86c0-1.88-.03-4.29-2.62-4.29-2.63 0-3.03 2.05-3.03 4.15V24H8.67V8.53z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/sheconnects.work" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-500 transition-all hover:border-pink-500 hover:text-white hover:bg-pink-600/20" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 9.5zm4.75-3.75a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.label}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{col.label}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">© {year} {c.copyright}</p>
          <p className="text-[11px] text-slate-600">Digital work with human impact</p>
        </div>
      </div>
    </footer>
  );
}
