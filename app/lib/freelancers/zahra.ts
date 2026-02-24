import { Freelancer } from "../freelancers";

export const zahra: Freelancer = {
  slug: "zahra",
  name: "Zahra",
  categories: {
    en: ["Translation", "Online Teacher"],
    it: ["Traduzione", "Insegnante Online"],
  },
  en: {
    role: "Document Translator & Online Educator",
    bio: "Zahra Ayobi is a professional translator and educator proficient in English and Dari. With a background in academic writing and international debates, she possesses strong communication and digital skills. Currently working as an online educator, she specializes in teaching school subjects and preparing professional documents. Zahra seeks remote opportunities due to restrictions on women’s work in Afghanistan.",
    languages: "English, Dari",
    services: [
      "Document Translation (English, Dari)",
      "Online Teaching (School Subjects)",
      "Confidential and sensitive document handling",
      "Transcription services",
    ],
  },
  it: {
    role: "Traduttrice e Insegnante Online",
    bio: "Zahra Ayobi è una traduttrice e educatrice professionale esperta in inglese e dari. Con un background in scrittura accademica e dibattiti internazionali, possiede forti capacità comunicative e digitali. Attualmente insegnante online, è specializzata nell'insegnamento di materie scolastiche e nella redazione di documenti professionali. Zahra cerca opportunità remote a causa delle restrizioni al lavoro femminile in Afghanistan.",
    languages: "Inglese, Dari",
    services: [
      "Traduzione di documenti (Inglese, Dari)",
      "Insegnamento Online (Materie Scolastiche)",
      "Gestione di documenti riservati e sensibili",
      "Servizi di trascrizione",
    ],
  },
  portfolio: [
    {
      title: {
        en: "Professional Resume",
        it: "Curriculum Professionale",
      },
      description: {
        en: "Zahra's professional background and qualifications.",
        it: "Background professionale e qualifiche di Zahra.",
      },
      link: "/portfolio/zahra-resume.png",
      type: "link",
    },
    {
      title: {
        en: "English to Dari Translation Sample",
        it: "Esempio di traduzione da Inglese a Dari",
      },
      description: {
        en: "A sample of professional translation work.",
        it: "Un esempio di lavoro di traduzione professionale.",
      },
      link: "/portfolio/zahra-translation-sample.png",
      type: "link",
    },
    {
      title: {
        en: "Lesson Presentation Sample",
        it: "Esempio di presentazione didattica",
      },
      description: {
        en: "A sample of academic materials prepared for online teaching.",
        it: "Un esempio di materiali accademici preparati per l'insegnamento online.",
      },
      link: "/portfolio/zahra-lesson-sample.pdf",
      type: "pdf",
    },
    {
      title: {
        en: "Digital Document Design",
        it: "Progettazione di documenti digitali",
      },
      description: {
        en: "Example of professional document formatting and design.",
        it: "Esempio di formattazione e design professionale di documenti.",
      },
      link: "/portfolio/zahra-design-sample.png",
      type: "link",
    },
  ],
};
