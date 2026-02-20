import { Freelancer } from "../freelancers";

export const gita: Freelancer = {
  slug: "gita",
  name: "Gita",
  // Removed "Graphic Design" - only "Translation" remains
  categories: ["Translation"], 
  en: {
    role: "Document Translation Specialist (English, Dari, Uzbeki)",
    bio: "My name is Gita. I am a freelance document translator working between English, Dari, and Uzbeki. I have a background in research, journalism, and women’s rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women’s work in Afghanistan, I migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
    services: [
      "Document translation (English ↔ Dari ↔ Uzbeki)",
      "Confidential and sensitive document handling",
      "Proofreading and editing",
      "Localization for tone and cultural context",
      "Specialized Languages: English, Dari, Uzbeki", // Highlighted languages
    ],
  },
  it: {
    role: "Specialista in Traduzioni Documentali (Inglese, Dari, Uzbeki)",
    bio: "Mi chiamo Gita. Sono una traduttrice freelance di documenti dall'inglese al Dari e Uzbeki. Ho un background in ricerca, giornalismo e documentazione sui diritti delle donne, che mi ha fornito forti capacità di scrittura e analisi. A causa di gravi rischi per la sicurezza e restrizioni al lavoro delle donne in Afghanistan, sono emigrata in Pakistan. Ora lavoro da remoto, concentrandomi su traduzioni professionali e riservate per sostenere me stessa e la mia famiglia.",
    services: [
      "Traduzione di documenti (Inglese ↔ Dari ↔ Uzbeki)",
      "Gestione di documenti riservati e sensibili",
      "Correzione di bozze ed editing",
      "Localizzazione per tono e contesto culturale",
      "Lingue Specializzate: Inglese, Dari, Uzbeki", // Highlighted languages
    ],
  },
  portfolio: [
    {
      title: "English to Dari Translation Sample",
      description: "Sample of technical translation from English to Dari.",
      link: "/portfolio/gita-en-to-dari.pdf",
      type: "pdf",
    },
    {
      title: "Dari to English Translation Sample",
      description: "Sample of technical translation from Dari to English.",
      link: "/portfolio/gita-dari-to-en.pdf",
      type: "pdf",
    },
  ],
};
