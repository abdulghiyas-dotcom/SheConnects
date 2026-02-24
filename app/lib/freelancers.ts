import { gita } from "./freelancers/gita";
import { zahra } from "./freelancers/zahra";
import { farwa } from "./freelancers/farwa";

// 1. Define Types First
export type PortfolioItem = {
  title: {
    en: string;
    it: string;
  };
  description: {
    en: string;
    it: string;
  };
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
  categories: {
    en: string[];
    it: string[];
  };
  en: FreelancerContent;
  it: FreelancerContent;
  portfolio: PortfolioItem[];
};

// 2. Use the Types for the Exported Array
export const freelancers: Freelancer[] = [
  gita,
  zahra,
  farwa,
];
