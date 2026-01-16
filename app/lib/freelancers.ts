export type FreelancerCategory =
  | "Programming"
  | "Translation"
  | "Creative & Design"
  | "Research & Data";

export type PortfolioItem = {
  label: string;
  url: string; // https://...
};

export type Freelancer = {
  slug: string;
  name: string;
  bio: string; // ~75 words
  categories: FreelancerCategory[];
  services: string[];
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  {
    slug: "sample-freelancer",
    name: "Sample Freelancer",
    bio:
      "Sample Freelancer is an Afghan professional supporting international teams through translation and research. She has experience with NGO program content, donor-facing briefs, and multilingual materials (English ↔ Dari/Farsi). She is detail-oriented, reliable with deadlines, and comfortable collaborating remotely with European organizations under confidentiality.",
    categories: ["Translation", "Research & Data"],
    services: [
      "English ↔ Dari/Farsi/Pashto translation",
      "Localization & cultural adaptation",
      "Desk research and data cleaning",
    ],
    portfolio: [
      { label: "Portfolio (Google Drive)", url: "https://example.com" },
      { label: "Writing sample", url: "https://example.com" },
    ],
  },
];

