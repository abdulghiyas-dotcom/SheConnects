import { Freelancer } from "../freelancers";

export const zahra: Freelancer = {
  slug: "zahra",
  name: "Zahra",
  categories: ["Translation", "Online Teacher"],
  en: {
    role: "Document Translator & Online Educator",
    bio: "Zahra Ayobi is a professional translator and educator proficient in English, Dari, and Pashto. With a background in academic writing and international debates, she possesses strong communication and digital skills. Currently working as an administrative assistant, she specializes in teaching school subjects online and preparing professional documents. Zahra seeks remote opportunities due to restrictions on women’s work in Afghanistan.",
    languages: "English, Dari, Pashto",
    services: [
      "Document Translation (English, Dari, Pashto)",
      "Online Teaching (School Subjects)",
      "Professional Document Formatting",
      "Administrative Support",
    ],
  },
  it: {
    role: "Traduttrice e Insegnante Online",
    bio: "Zahra Ayobi è una traduttrice e educatrice professionale esperta in inglese, dari e pashtu. Con un background in scrittura accademica e dibattiti internazionali, possiede forti capacità comunicative e digitali. Attualmente assistente amministrativa, è specializzata nell'insegnamento online di materie scolastiche e nella redazione di documenti professionali. Zahra cerca opportunità remote a causa delle restrizioni al lavoro femminile in Afghanistan.",
    languages: "Inglese, Dari, Pashto",
    services: [
      "Traduzione di documenti (Inglese, Dari, Pashto)",
      "Insegnamento Online (Materie Scolastiche)",
      "Formattazione Documenti Professionali",
      "Supporto Amministrativo",
    ],
  },
  portfolio: [
    {
      title: "Professional Resume",
      description: "Zahra's professional background and qualifications.",
      link: "/portfolio/zahra-resume.png",
      type: "link",
    },
    {
      title: "Lesson Presentation Sample",
      description: "A sample of academic materials prepared for online teaching.",
      link: "/portfolio/zahra-lesson-sample.pdf",
      type: "pdf",
    },
    {
      title: "Digital Document Design",
      description: "Example of professional document formatting and design.",
      link: "/portfolio/zahra-design-sample.png",
      type: "link",
    },
  ],
};
