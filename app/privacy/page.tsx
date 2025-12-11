import type { Metadata } from "next";
import PrivacyContent from "../components/PrivacyContent";
import { getPreferredLanguage } from "../lib/language";

export const metadata: Metadata = {
  title: "Privacy Policy – SheConnects",
  description:
    "Learn how SheConnects collects, uses, and protects your information when you visit our site or use our services, including how we use cookies and analytics in line with GDPR.",
};

export default function PrivacyPage() {
  const initialLanguage = getPreferredLanguage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PrivacyContent initialLanguage={initialLanguage} />
    </main>
  );
}
