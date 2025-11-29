import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Impact from "./components/Impact";
import ForOrganizations from "./components/ForOrganizations";
import ForVAs from "./components/ForVAs";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Impact />
      <ForOrganizations />
      <ForVAs />
      <Testimonials />
      <ContactSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
