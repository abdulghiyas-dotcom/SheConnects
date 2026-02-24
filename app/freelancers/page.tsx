import { getPreferredLanguage } from "../lib/language";
import FreelancersPageClient from "./FreelancersPageClient";

export default function FreelancersPage() {
  const initialLanguage = getPreferredLanguage();

  return <FreelancersPageClient initialLanguage={initialLanguage} />;
}
