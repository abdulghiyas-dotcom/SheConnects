import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sheconnects.work"),
  title: "SheConnects – Digital work with human impact",
  description:
    "Digital work with human impact. SheConnects is a managed service studio powered by Afghan women professionals, delivering ethical remote support for research, content, and digital tasks.",
  openGraph: {
    title: "SheConnects – Digital work with human impact",
    description:
      "SheConnects connects Afghan women professionals with organizations through managed, ethical remote support for research, content, and digital execution.",
    url: "https://www.sheconnects.work",
    siteName: "SheConnects",
    images: [
      {
        url: "/sheconnects-logo.svg",
        width: 512,
        height: 512,
        alt: "SheConnects logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SheConnects – Digital work with human impact",
    description:
      "SheConnects is a managed service studio powered by Afghan women professionals, delivering ethical remote support for research, content, and digital tasks.",
    images: ["/sheconnects-logo.svg"],
  },
  icons: {
    icon: "/sheconnects-logo.svg",
  },
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
      "Digital work with human impact. Impact-driven remote service studio connecting Afghan women professionals with organizations in Europe.",
    logo: "https://www.sheconnects.work/sheconnects-logo.svg",
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
