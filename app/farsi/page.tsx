import type { Metadata } from "next";
import FarsiProgramLandingPage from "./FarsiProgramLandingPage";

export const metadata: Metadata = {
  title: "Online Mother-Tongue Farsi Classes for Children in Europe | SheConnects",
  description:
    "Interactive online Farsi/Dari classes for children in Europe, taught by Farwa from Afghanistan. Help your child preserve their mother tongue while supporting women in Afghanistan through SheConnects.",
  alternates: {
    canonical: "/farsi",
  },
  openGraph: {
    title: "Online Mother-Tongue Farsi Classes for Children | SheConnects",
    description:
      "Help your child keep their mother tongue alive while creating meaningful work for women in Afghanistan.",
    url: "/farsi",
    siteName: "SheConnects",
    type: "website",
  },
};

export default function FarsiPage() {
  return <FarsiProgramLandingPage />;
}
