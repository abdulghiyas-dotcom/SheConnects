export type FreelancerCategory =
  | "Programming"
  | "Translation"
  | "Creative & Design"
  | "Research & Data"
  | "Online Teaching";

export type PortfolioItem = {
  label: string;
  url: string; // must be https://...
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
    slug: "amina-online-teaching",
    name: "Amina",
    bio:
      "Amina is an Afghan educator with experience delivering structured, learner-centered online lessons. She supports English learning and academic tutoring, adapting lesson plans to different levels and goals. She has worked with youth and adult learners and is comfortable collaborating with international teams and NGO programs. Her teaching style is clear, encouraging, and focused on measurable progress.",
    categories: ["Online Teaching", "Translation"],
    services: [
      "Online English language instruction",
      "Dari/Farsi language tutoring",
      "Lesson planning and assessments",
      "Localization support for learning materials",
    ],
    portfolio: [
      { label: "Teaching syllabus (sample)", url: "https://example.com" },
      { label: "Lesson sample (recording or notes)", url: "https://example.com" },
    ],
  },
  {
    slug: "sahar-translation-research",
    name: "Sahar",
    bio:
      "Sahar supports NGOs and mission-driven teams through translation and desk research. She has experience working on program documents, donor-facing briefs, and multilingual materials (English ↔ Dari/Farsi/Pashto). She is detail-oriented, reliable with deadlines, and used to handling sensitive content under confidentiality while collaborating remotely across time zones.",
    categories: ["Translation", "Research & Data"],
    services: [
      "English ↔ Dari/Farsi/Pashto translation",
      "Localization & cultural adaptation",
      "Desk research and summarization",
      "Data cleaning and structuring",
    ],
    portfolio: [
      { label: "Portfolio (Drive folder)", url: "https://example.com" },
      { label: "Writing sample", url: "https://example.com" },
    ],
  },
];
