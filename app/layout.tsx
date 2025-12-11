import "./globals.css";
import type { Metadata } from "next";
import CookieConsent from "./components/CookieConsent";

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
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
