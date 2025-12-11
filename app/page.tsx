import PageContent from "./components/PageContent";
import { getPreferredLanguage } from "./lib/language";

export default function HomePage() {
  const initialLanguage = getPreferredLanguage();

  return (
    <main className="min-h-screen bg-transparent text-slate-900">
      <PageContent initialLanguage={initialLanguage} />
    </main>
  );
}
