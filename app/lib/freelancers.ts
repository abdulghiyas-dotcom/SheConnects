import { gita } from "./freelancers/gita";

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

// Add new freelancers to this list after creating their files
export const freelancers: Freelancer[] = [
  gita,
];
