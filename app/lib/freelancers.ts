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
  services: string[];
};

export type Freelancer = {
  slug: string;
  name: string;
  categories: string[];
  en: FreelancerContent; // English block
  it: FreelancerContent; // Italian block
  portfolio: PortfolioItem[];
};

export const freelancers: Freelancer[] = [
  gita,
];
