"use client";

import { useEffect, useState } from "react";
import SiteHeader from "./SiteHeader";
import DarkHero from "./DarkHero";
import TrustBar from "./TrustBar";
import HowItWorksNew from "./HowItWorksNew";
import StudioTracks from "./StudioTracks";
import ImpactCounters from "./ImpactCounters";
import MissionSection from "./MissionSection";
import FinalCtaDark from "./FinalCtaDark";
import Footer from "./Footer";
import { Language, defaultLanguage, translations } from "../lib/translations";

function normalizeLanguage(value: string | undefined): Language {
  return value === "it" ? "it" : "en";
}

type Props = { initialLanguage?: Language };

export default function DarkPageContent({ initialLanguage = defaultLanguage }: Props) {
  const [language, setLanguage] = useState<Language>(normalizeLanguage(initialLanguage));

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  return (
    <>
      <SiteHeader language={language} onLanguageChange={setLanguage} overlay />
      <DarkHero language={language} />
      <TrustBar language={language} />
      <HowItWorksNew language={language} />
      <StudioTracks language={language} />
      <ImpactCounters language={language} />
      <MissionSection language={language} />
      <FinalCtaDark language={language} />
      <Footer content={translations[language].footer} />
    </>
  );
}
