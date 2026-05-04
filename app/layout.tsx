import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getPreferredLanguage } from "./lib/language";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

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
    <html lang={lang} className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
