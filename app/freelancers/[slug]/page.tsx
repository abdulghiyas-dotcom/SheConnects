import { getPreferredLanguage } from "../../lib/language";
import FreelancerProfileClient from "./FreelancerProfileClient";

type Props = { params: { slug: string } };

export default function FreelancerProfilePage({ params }: Props) {
  const initialLanguage = getPreferredLanguage();

  return <FreelancerProfileClient slug={params.slug} initialLanguage={initialLanguage} />;
}
