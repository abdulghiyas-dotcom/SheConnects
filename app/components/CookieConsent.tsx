"use client";

import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = "G-6TFGCR6FFQ"; // 👈 Your GA4 ID
const CONSENT_KEY = "sheconnects_cookie_consent";

type ConsentValue = "accepted" | "rejected" | "unset";

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>("unset");

  // On first load, check if user already made a choice
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }
  }, []);

  // When consent becomes "accepted", load Google Analytics
  useEffect(() => {
    if (consent !== "accepted") return;
    if (!GA_MEASUREMENT_ID) return;

    // Avoid injecting twice
    if (document.getElementById("ga-main-script")) return;

    // Load GA script
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

  // If user already chose, hide the banner
  if (consent !== "unset") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-300">
        <p className="text-xs text-slate-700">
          We use cookies for anonymous analytics to understand how SheConnects is
          used and to improve our services. You can choose to accept or reject
          analytics cookies. We don&apos;t use marketing or tracking cookies here.
        </p>

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reject analytics
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-95"
          >
            Accept analytics
          </button>
        </div>

        <p className="mt-2 text-[10px] text-slate-500">
          You can learn more in our{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-violet-700"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
