"use client";

import { useEffect, useState } from "react";
import { SiteContent } from "../lib/translations";

const GA_MEASUREMENT_ID = "G-6TFGCR6FFQ";
const CONSENT_KEY = "sheconnects_cookie_consent";

type ConsentValue = "accepted" | "rejected" | "unset";

type CookieConsentProps = {
  content: SiteContent["cookie"];
};

export default function CookieConsent({ content }: CookieConsentProps) {
  const [consent, setConsent] = useState<ConsentValue>("unset");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    if (!GA_MEASUREMENT_ID) return;

    if (document.getElementById("ga-main-script")) return;

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script1.id = "ga-main-script";

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }, [consent]);

  const handleAccept = () => {
    setConsent("accepted");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    }
  };

  const handleReject = () => {
    setConsent("rejected");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_KEY, "rejected");
    }
  };

  if (consent !== "unset") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-300">
        <p className="text-xs text-slate-700">
          {content.message}
        </p>

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {content.reject}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-95"
          >
            {content.accept}
          </button>
        </div>

        <p className="mt-2 text-[10px] text-slate-500">
          {content.learnMorePrefix}{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-violet-700"
          >
            {content.learnMore}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
