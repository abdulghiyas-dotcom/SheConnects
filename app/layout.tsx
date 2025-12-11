import "./globals.css";
import type { Metadata } from "next";
import { getPreferredLanguage } from "./lib/language";

export const metadata: Metadata = {
  title: "SheConnects – Digital work with human impact",
  description:
    "Impact-driven remote service studio powered by Afghan women, offering ethical remote services in translation, programming, design, and research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getPreferredLanguage();

  return (
    <html lang={lang}>
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
