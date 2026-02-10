export type PortfolioItem = {
  title: string;
  description: string;
  link: string;
  type: "pdf" | "link";
};

export type Freelancer = {
  slug: string;
  name: string;
  role: string;
  categories: string[]; // These will be used for your filters: Programming, Graphic Design, Teaching Online, Market Research, Document Translation
  bio: string;
  services: string[];
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  {
    slug: "gita",
    name: "Gita",
    role: "Graphic Designer & Document Translation Specialist",
    categories: ["Graphic Design", "Document Translation"],
    bio: "Creative professional with over 4 years of experience in visual storytelling and linguistic services. Gita specializes in bridging cultural gaps through both high-quality illustrations and accurate document translations.",
    services: [
      "Brand Identity & Logo Design",
      "Digital Illustration",
      "English ↔ Dari Document Translation",
      "English ↔ Pashto Document Translation",
    ],
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
