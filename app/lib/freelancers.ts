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
  en: FreelancerContent; // English version
  it: FreelancerContent; // Italian version
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  {
    slug: "gita",
    name: "Gita",
    categories: ["Graphic Design", "Document Translation"],
    en: {
      role: "Graphic Designer & Document Translation Specialist",
      bio: "Creative professional with over 4 years of experience in visual storytelling and linguistic services. Gita specializes in bridging cultural gaps through both high-quality illustrations and accurate document translations.",
      services: [
        "Brand Identity & Logo Design",
        "Digital Illustration",
        "English ↔ Dari Document Translation",
        "English ↔ Pashto Document Translation",
      ],
    },
    it: {
      role: "Graphic Designer e Specialista in Traduzioni",
      bio: "Professionista creativa con oltre 4 anni di esperienza nello storytelling visivo e nei servizi linguistici. Gita è specializzata nel superare le barriere culturali attraverso illustrazioni di alta qualità e traduzioni accurate.",
      services: [
        "Brand Identity e Logo Design",
        "Illustrazione Digitale",
        "Traduzione Documenti Inglese ↔ Dari",
        "Traduzione Documenti Inglese ↔ Pashto",
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
