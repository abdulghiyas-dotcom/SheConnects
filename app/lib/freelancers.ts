export type PortfolioItem = {
  label: string;
  url: string;
};

export type Freelancer = {
  slug: string;
  name: string;
  bio: string;
  categories: string[];
  services: string[];
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  {
    slug: "gita",
    name: "Gita",
    bio:
      "My name is Gita. I am a freelance document translator working between English and Persian (Dari). I have a background in research, journalism, and women’s rights documentation, which gave me strong writing and analytical skills. Due to serious security risks and restrictions on women’s work in Afghanistan, I could not continue working locally and migrated to Pakistan. I now work remotely, focusing on accurate, professional, and confidential document translation to support myself and my family.",
    categories: ["Translation"],
    services: [
      "Document translation (English ↔ Persian/Dari)",
      "Confidential and sensitive document handling",
      "Proofreading and editing",
      "Localization for tone and cultural context",
    ],
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
  },
];
