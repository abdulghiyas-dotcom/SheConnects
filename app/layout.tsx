import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SheConnects – Impact-Driven Remote Support Studio",
  description:
    "SheConnects is a service studio powered by Afghan women professionals, delivering ethical, managed remote support for research, content, and digital tasks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SheConnects",
    url: "https://www.sheconnects.work",
    description:
      "Impact-driven remote service studio connecting Afghan women professionals with organizations in Europe."
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
