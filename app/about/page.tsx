import type { Metadata } from "next";
import AboutContent from "../components/AboutContent";
import { getPreferredLanguage } from "../lib/language";

export const metadata: Metadata = {
  title: "About – SheConnects",
  description:
    "Learn about SheConnects' mission, vision, and values as a women-led ethical outsourcing company connecting Afghan talent to global opportunities.",
};

export default function AboutPage() {
  const initialLanguage = getPreferredLanguage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AboutContent initialLanguage={initialLanguage} />
    </main>
  );
}
