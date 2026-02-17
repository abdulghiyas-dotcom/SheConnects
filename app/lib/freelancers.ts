import { gita } from "./freelancers/gita";

// This definition must match the data in gita.ts exactly
export type PortfolioItem = {
  title: string;
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
  en: FreelancerContent;
  it: FreelancerContent;
  portfolio: PortfolioItem[];
};

// This array exports all freelancers to the rest of the app
export const freelancers: Freelancer[] = [
  gita,
];
