import type { Metadata } from "next";
import FarsiProgramLandingPage from "./FarsiProgramLandingPage";

export const metadata: Metadata = {
  title: "Online Farsi Classes for Afghan Children in Europe | SheConnects",
  description:
    "Interactive online Farsi/Dari classes for Afghan children in Europe, taught by Farwa from Afghanistan. Help your child preserve language, culture, and identity while supporting Afghan women through SheConnects.",
  alternates: {
    canonical: "/farsi",
  },
  openGraph: {
    title: "Online Farsi Classes for Afghan Children | SheConnects",
    description:
      "Help your child learn Farsi, stay connected to Afghan heritage, and create meaningful work for Afghan women.",
    url: "/farsi",
    siteName: "SheConnects",
    type: "website",
  },
};

export default function FarsiPage() {
  return <FarsiProgramLandingPage />;
}
