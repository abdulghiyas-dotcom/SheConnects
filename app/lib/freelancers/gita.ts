import { Freelancer } from "../freelancers";

export const gita: Freelancer = {
  slug: "gita",
  name: "Gita",
  categories: {
    en: ["Translation"],
    it: ["Traduzione"],
  },
  en: {
    role: "Document Translation Specialist",
    bio: "My name is Gita. I am a freelance document translator working between English, Dari, and Uzbeki. I have a background in research, journalism, and women’s rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women’s work in Afghanistan, I migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
    // Highlighted languages section placed before services
    languages: "English, Dari, Uzbeki", 
    services: [
      "Document translation (English ↔ Dari ↔ Uzbeki)",
      "Confidential and sensitive document handling",
      "Proofreading and editing",
      "Localization for tone and cultural context",
    ],
  },
  it: {
    role: "Specialista in Traduzioni Documentali",
    bio: "Mi chiamo Gita. Sono una traduttrice freelance di documenti dall'inglese al Dari e Uzbeki. Ho un background in ricerca, giornalismo e documentazione sui diritti delle donne, che mi ha fornito forti capacità di scrittura e analisi. A causa di gravi rischi per la sicurezza e restrizioni al lavoro delle donne in Afghanistan, sono emigrata in Pakistan. Ora lavoro da remoto, concentrandomi su traduzioni professionali e riservate per sostenere me stessa e la mia famiglia.",
    // Sezione lingue evidenziate in italiano
    languages: "Inglese, Dari, Uzbeki",
    services: [
      "Traduzione di documenti (Inglese ↔ Dari ↔ Uzbeki)",
      "Gestione di documenti riservati e sensibili",
      "Correzione di bozze ed editing",
      "Localizzazione per tono e contesto culturale",
    ],
  },
  portfolio: [
    {
      title: {
        en: "English to Dari Translation Sample",
        it: "Esempio di traduzione da Inglese a Dari",
      },
      description: {
        en: "Sample of technical translation from English to Dari.",
        it: "Esempio di traduzione tecnica dall'inglese al dari.",
      },
      link: "/portfolio/gita-en-to-dari.pdf",
      type: "pdf",
    },
    {
      title: {
        en: "Dari to English Translation Sample",
        it: "Esempio di traduzione da Dari a Inglese",
      },
      description: {
        en: "Sample of technical translation from Dari to English.",
        it: "Esempio di traduzione tecnica dal dari all'inglese.",
      },
      link: "/portfolio/gita-dari-to-en.pdf",
      type: "pdf",
    },
  ],
};
