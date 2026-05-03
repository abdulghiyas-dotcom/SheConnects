import Image from "next/image";
import Link from "next/link";
import { SiteContent } from "../lib/translations";

type FooterProps = {
  content: SiteContent["footer"];
};

export default function Footer({ content }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/icon.png"
                alt="SheConnects logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-bold text-white">SheConnects SRL</p>
                <p className="text-[11px] text-slate-500">P. IVA 14470870966</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {content.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-500">{content.location}</p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/sheconnects.work"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 9.5zm4.75-3.75a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/sheconnects-work"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.55V24H.22V8.53zM8.67 8.53h4.37v2.11h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.49 3.05 5.49 7.02V24h-4.55v-7.86c0-1.88-.03-4.29-2.62-4.29-2.63 0-3.03 2.05-3.03 4.15V24H8.67V8.53z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/SheConnects/61579434964386/"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326V22.67c0 .733.593 1.326 1.325 1.326h11.495v-9.835H9.691v-3.83h3.129V7.548c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.313h3.587l-.467 3.83h-3.12V24h6.117c.73 0 1.323-.593 1.323-1.326V1.326C24 .593 23.405 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/app/sign-up" className="hover:text-white transition-colors">Get started</Link></li>
              <li><Link href="/app/sign-in" className="hover:text-white transition-colors">Sign in</Link></li>
              <li><Link href="/freelancers" className="hover:text-white transition-colors">Browse freelancers</Link></li>
              <li><Link href="/app/apply" className="hover:text-white transition-colors">Apply as a freelancer</Link></li>
            </ul>
          </div>

          {/* Company + Legal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li>
                <a href="mailto:hello@sheconnects.work" className="hover:text-white transition-colors">
                  hello@sheconnects.work
                </a>
              </li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{content.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            © {year} SheConnects SRL · P. IVA 14470870966 · Milan, Italy
          </p>
          <p className="text-[11px] text-slate-600">
            Digital work with human impact
          </p>
        </div>
      </div>
    </footer>
  );
}
