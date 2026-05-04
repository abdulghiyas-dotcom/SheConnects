"use client";

import { useEffect, useState } from "react";
import DarkHeader from "./DarkHeader";
import DarkHero from "./DarkHero";
import TrustBar from "./TrustBar";
import HowItWorksNew from "./HowItWorksNew";
import StudioTracks from "./StudioTracks";
import ImpactCounters from "./ImpactCounters";
import MissionSection from "./MissionSection";
import FinalCtaDark from "./FinalCtaDark";
import DarkFooter from "./DarkFooter";
import { Language, defaultLanguage } from "../lib/translations";

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
      <DarkHeader language={language} onLanguageChange={setLanguage} />
      <DarkHero language={language} />
      <TrustBar language={language} />
      <HowItWorksNew language={language} />
      <StudioTracks language={language} />
      <ImpactCounters language={language} />
      <MissionSection language={language} />
      <FinalCtaDark language={language} />
      <DarkFooter language={language} />
    </>
  );
}
