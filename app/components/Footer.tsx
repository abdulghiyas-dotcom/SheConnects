import Image from "next/image";
import { SiteContent } from "../lib/translations";

type FooterProps = {
  content: SiteContent["footer"];
};

export default function Footer({ content }: FooterProps) {
  const copyrightText = content.copyright.replace(
    "{year}",
    new Date().getFullYear().toString()
  );

  return (
    <footer className="border-t border-violet-100 bg-gradient-to-r from-white via-white to-violet-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 text-xs text-slate-600 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="SheConnects logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <p className="font-semibold text-slate-800">SheConnects</p>
          </div>

          <p className="mt-1">{content.tagline}</p>
          <p className="mt-1 text-slate-700">{content.location}</p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3">
          <p>
            {content.contact}{" "}
            <a
              href="mailto:hello@sheconnects.work"
              className="underline hover:text-violet-700"
            >
              hello@sheconnects.work
            </a>
          </p>

          <p>
            <a
              href="/privacy"
              className="underline hover:text-violet-700"
            >
              {content.privacy}
            </a>
          </p>

          <div className="flex gap-4 mt-1">
            <a
              href="https://www.instagram.com/sheconnects.work"
              className="hover:opacity-80 transition"
              aria-label="Instagram"
            >
              <svg
                className="h-5 w-5 text-slate-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 9.5zm4.75-3.75a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/sheconnects-work"
              className="hover:opacity-80 transition"
              aria-label="LinkedIn"
            >
              <svg
                className="h-5 w-5 text-slate-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.55V24H.22V8.53zM8.67 8.53h4.37v2.11h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.49 3.05 5.49 7.02V24h-4.55v-7.86c0-1.88-.03-4.29-2.62-4.29-2.63 0-3.03 2.05-3.03 4.15V24H8.67V8.53z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/people/SheConnects/61579434964386/"
              className="hover:opacity-80 transition"
              aria-label="Facebook"
            >
              <svg
                className="h-5 w-5 text-slate-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326V22.67c0 .733.593 1.326 1.325 1.326h11.495v-9.835H9.691v-3.83h3.129V7.548c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.313h3.587l-.467 3.83h-3.12V24h6.117c.73 0 1.323-.593 1.323-1.326V1.326C24 .593 23.405 0 22.675 0z"/>
              </svg>
            </a>
          </div>

          <p className="text-[11px] text-slate-700 mt-2">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
