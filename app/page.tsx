import DarkPageContent from "./components/DarkPageContent";
import { getPreferredLanguage } from "./lib/language";

export default function HomePage() {
  const initialLanguage = getPreferredLanguage();

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <DarkPageContent initialLanguage={initialLanguage} />
    </main>
  );
}
