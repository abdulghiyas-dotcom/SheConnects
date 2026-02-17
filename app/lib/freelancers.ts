export type PortfolioItem = {
  title: string;
  description: string;
  link: string;
  type: "pdf" | "link";
};

export type FreelancerContent = {
  role: string;
  bio: string;
  services: string[];
};

export type Freelancer = {
  slug: string;
  name: string;
  categories: string[];
  en: FreelancerContent; // English text
  it: FreelancerContent; // Italian text
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  {
    slug: "gita",
    name: "Gita",
    categories: ["Graphic Design", "Document Translation"],
    en: {
      role: "Graphic Designer & Document Translation Specialist",
      bio: "My name is Gita. I am a freelance document translator working between English and Persian (Dari). I have a background in research, journalism, and women’s rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women’s work in Afghanistan, I could not continue working locally and migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
      services: [
        "Brand Identity & Logo Design",
        "Digital Illustration",
        "English ↔ Dari Document Translation",
      ],
    },
    it: {
      role: "Graphic Designer e Specialista in Traduzioni",
      bio: "Mi chiamo Gita. Sono una traduttrice freelance di documenti dall'inglese al persiano (Dari). Ho un background in ricerca, giornalismo e documentazione sui diritti delle donne, che mi ha fornito forti capacità di scrittura e analisi. A causa di gravi rischi per la sicurezza e restrizioni al lavoro delle donne in Afghanistan, non ho potuto continuare a lavorare localmente e sono emigrata in Pakistan. Ora lavoro da remoto, concentrandomi su traduzioni professionali e riservate per sostenere me stessa e la mia famiglia.",
      services: [
        "Brand Identity e Logo Design",
        "Illustrazione Digitale",
        "Traduzione Documenti Inglese ↔ Dari",
      ],
    },
    portfolio: [
      {
        title: "English to Dari Translation Sample",
        description: "A technical translation project demonstrating linguistic accuracy.",
        link: "/portfolio/gita-en-to-dari.pdf",
        type: "pdf",
      },
      {
        title: "Dari to English Translation Sample",
        description: "Creative translation and localization for marketing materials.",
        link: "/portfolio/gita-dari-to-en.pdf",
        type: "pdf",
      },
    ],
  },
];
