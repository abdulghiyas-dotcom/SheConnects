import PlatformLanding from "./components/PlatformLanding";
import { getPreferredLanguage } from "./lib/language";

export default function HomePage() {
  const initialLanguage = getPreferredLanguage();

  return (
    <PlatformLanding initialLanguage={initialLanguage} />
  );
}
