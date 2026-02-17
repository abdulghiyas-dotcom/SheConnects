import { Freelancer } from "../freelancers";

export const gita: Freelancer = {
  slug: "gita",
  name: "Gita",
  categories: ["Translation"],
  en: {
    role: "Graphic Designer & Document Translation Specialist",
    bio: "My name is Gita. I am a freelance document translator working between English and Persian (Dari). I have a background in research, journalism, and women’s rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women’s work in Afghanistan, I could not continue working locally and migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
    services: [
      "Document translation (English ↔ Persian/Dari)",
      "Confidential and sensitive document handling",
      "Proofreading and editing",
      "Localization for tone and cultural context",
    ],
  },
  it: {
    role: "Graphic Designer e Specialista in Traduzioni",
    bio: "Mi chiamo Gita. Sono una traduttrice freelance di documenti dall'inglese al persiano (Dari). Ho un background in ricerca, giornalismo e documentazione sui diritti delle donne, che mi ha fornito forti capacità di scrittura e analisi. A causa di gravi rischi per la sicurezza e restrizioni al lavoro delle donne in Afghanistan, non ho potuto continuare a lavorare localmente e sono emigrata in Pakistan. Ora lavoro da remoto, concentrandomi su traduzioni professionali e riservate per sostenere me stessa e la mia famiglia.",
    services: [
      "Traduzione di documenti (Inglese ↔ Persiano/Dari)",
      "Gestione di documenti riservati e sensibili",
      "Correzione di bozze ed editing",
      "Localizzazione per tono e contesto culturale",
    ],
  },
  portfolio: [
    {
      label: "Sample translation (English → Persian/Dari)",
      url: "/portfolio/gita-en-to-dari.pdf",
    },
    {
      label: "Sample translation (Persian/Dari → English)",
      url: "/portfolio/gita-dari-to-en.pdf",
    },
  ],
};
