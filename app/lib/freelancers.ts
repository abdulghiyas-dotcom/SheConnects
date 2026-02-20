import { gita } from "./freelancers/gita";

export type PortfolioItem = {
  title: string;
  description: string;
  link: string;
  type: "pdf" | "link";
};

export type FreelancerContent = {
  role: string;
  bio: string;
  languages: string; // Added this line to fix the build error
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
];
