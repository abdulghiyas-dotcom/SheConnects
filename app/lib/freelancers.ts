import { gita } from "./freelancers/gita";
import { zahra } from "./freelancers/zahra"; // New import

export type PortfolioItem = {
  title: string;
  description: string;
  link: string;
  type: "pdf" | "link";
};

export type FreelancerContent = {
  role: string;
  bio: string;
  languages: string;
  services: string[];
};

export type Freelancer = {
  slug: string;
  name: string;
  categories: string[];
  en: FreelancerContent;
  it: FreelancerContent;
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  gita,
  zahra, // Zahra is now added to the list
];
