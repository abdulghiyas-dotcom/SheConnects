"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Services from "./Services";
import HowItWorks from "./HowItWorks";
import Impact from "./Impact";
import ForOrganizations from "./ForOrganizations";
import ForVAs from "./ForVAs";
import Testimonials from "./Testimonials";
import ContactSection from "./ContactSection";
import FinalCta from "./FinalCta";
import Footer from "./Footer";
import Faq from "./Faq";
import CookieConsent from "./CookieConsent";
import {
  Language,
  SiteContent,
  defaultLanguage,
  translations,
} from "../lib/translations";

function normalizeLanguage(value: string | undefined): Language {
  return value === "it" ? "it" : "en";
}

type PageContentProps = {
  initialLanguage?: Language;
};

export default function PageContent({
  initialLanguage = defaultLanguage,
}: PageContentProps) {
  const [language, setLanguage] = useState<Language>(
    normalizeLanguage(initialLanguage)
  );

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const content: SiteContent = useMemo(() => {
    return translations[language];
  }, [language]);

  return (
    <>
      <Header
        content={content.header}
        language={language}
        onLanguageChange={setLanguage}
        languageNames={content.languageNames}
      />
      <Hero
        content={content.hero}
        common={content.common}
      />
      <Services content={content.services} />
      <HowItWorks content={content.howItWorks} />
      <Impact content={content.impact} />
      <ForOrganizations content={content.organizations} />
      <ForVAs content={content.vas} />
      <Testimonials content={content.testimonials} />
      <ContactSection content={content.contact} common={content.common} />
      <FinalCta content={content.finalCta} common={content.common} />
      <Faq content={content.faq} />
      <Footer content={content.footer} />
      <CookieConsent content={content.cookie} />
    </>
  );
}
