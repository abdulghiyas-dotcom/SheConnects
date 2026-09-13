"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Code2, Globe2, HeartHandshake, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Language } from "../lib/translations";

const copy = {
  en: {
    nav: ["How it works", "For organisations", "For talent", "Our impact"],
    signIn: "Sign in", start: "Find your match", eyebrow: "A trusted talent network with purpose",
    title: "Exceptional digital work.\nMeaningful opportunity.",
    text: "SheConnects brings ambitious organisations together with vetted Afghan women professionals — with the support, safeguards, and project structure to do great work together.",
    client: "Hire talent", talent: "Join the network", proof: "Vetted professionals", flow: "A calmer way to build great work",
    flowText: "From a focused brief to a successful delivery, every step is designed to build confidence on both sides.",
    impact: "Work that creates opportunity", impactText: "Every project connects businesses with real, long-term economic opportunity for Afghan women.",
    final: "Make your next project matter.", finalText: "Start with a brief, meet the right professional, and get meaningful work moving.",
  },
  it: {
    nav: ["Come funziona", "Per le organizzazioni", "Per il talento", "Il nostro impatto"],
    signIn: "Accedi", start: "Trova il tuo match", eyebrow: "Una rete di talenti affidabile e con uno scopo",
    title: "Lavoro digitale eccellente.\nOpportunità concrete.",
    text: "SheConnects mette in contatto organizzazioni ambiziose con professioniste afghane selezionate, offrendo supporto, tutele e una struttura di progetto per lavorare al meglio insieme.",
    client: "Trova talenti", talent: "Unisciti alla rete", proof: "Professioniste selezionate", flow: "Un modo più semplice di fare grandi cose",
    flowText: "Dal brief alla consegna, ogni passaggio è progettato per creare fiducia da entrambe le parti.",
    impact: "Lavoro che crea opportunità", impactText: "Ogni progetto crea opportunità economiche concrete e durature per le donne afghane.",
    final: "Rendi importante il tuo prossimo progetto.", finalText: "Inizia da un brief, incontra la persona giusta e dai slancio a un lavoro significativo.",
  },
} as const;

const services = [
  [Code2, "Digital & product", "Web development, engineering and technical support."],
  [Globe2, "Language & research", "Translation, localisation, research and data work."],
  [Sparkles, "Creative services", "Design, content and thoughtful brand experiences."],
];

export default function PlatformLanding({ initialLanguage }: { initialLanguage: Language }) {
  const [lang, setLang] = useState<Language>(initialLanguage === "it" ? "it" : "en");
  const [open, setOpen] = useState(false);
  const t = copy[lang];
  useEffect(() => { document.cookie = `lang=${lang}; path=/; max-age=31536000`; }, [lang]);
  const navLinks = ["#how-it-works", "#organisations", "#talent", "#impact"];

  return <div className="marketing-shell">
    <header className="marketing-nav">
      <Link href="/" className="brand"><Image src="/icon.png" alt="SheConnects" width={32} height={32} className="rounded-xl" /><span>SheConnects</span></Link>
      <nav className="marketing-links">{t.nav.map((label, i) => <a key={label} href={navLinks[i]}>{label}</a>)}</nav>
      <div className="marketing-actions"><div className="lang-switch"><button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={lang === "en" ? "active" : ""}>EN</button><button onClick={() => setLang("it")} aria-pressed={lang === "it"} className={lang === "it" ? "active" : ""}>IT</button></div><Link href="/app/sign-in" className="sign-in">{t.signIn}</Link><Link href="/app/sign-up" className="nav-cta">{t.start}</Link></div>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      {open && <div className="mobile-drawer">{t.nav.map((label, i) => <a key={label} href={navLinks[i]} onClick={() => setOpen(false)}>{label}</a>)}<Link href="/app/sign-in">{t.signIn}</Link><Link href="/app/sign-up" className="nav-cta">{t.start}</Link></div>}
    </header>

    <main>
      <section className="hero-new"><div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-copy"><p className="eyebrow"><span />{t.eyebrow}</p><h1>{t.title.split("\n").map((line, i) => <span key={line}>{line}{i === 0 && <br />}</span>)}</h1><p className="hero-text">{t.text}</p><div className="hero-buttons"><Link href="/app/sign-up" className="button-primary">{t.client} <ArrowRight size={17} /></Link><Link href="/app/apply" className="button-secondary">{t.talent}</Link></div><div className="hero-proof"><ShieldCheck size={18} /><span>{t.proof}</span><i /><span>Human-first delivery</span><i /><span>EU-based platform</span></div></div>
        <div className="hero-visual" aria-label="Project matching preview"><div className="visual-top"><span>PROJECT MATCH</span><span className="live-dot">● Live</span></div><h2>Website localisation</h2><p>Italian → English · Product launch</p><div className="match-card"><div className="avatar-gradient">ZN</div><div><strong>Zahra N.</strong><small>Translation specialist</small></div><span className="match-score">98% match</span></div><div className="visual-metrics"><div><strong>4.9</strong><span>average rating</span></div><div><strong>48h</strong><span>typical response</span></div><div><strong>100%</strong><span>vetted work</span></div></div><div className="visual-footer"><span>Matched by skills, availability & fit</span><Check size={16} /></div></div>
      </section>

      <section className="trust-strip"><span>TRUSTED, THOUGHTFUL DELIVERY FOR</span><div>Social enterprises</div><div>Purpose-led teams</div><div>Growing businesses</div><div>Global organisations</div></section>
      <section id="how-it-works" className="section flow-section"><div className="section-heading"><p className="section-kicker">HOW IT WORKS</p><h2>{t.flow}</h2><p>{t.flowText}</p></div><div className="flow-grid">{[["01", "Share what you need", "Create a simple brief or explore talent directly."],["02", "Meet the right person", "We make it easy to find a skilled professional who fits."],["03", "Work with clarity", "Keep offers, milestones, messages and payments in one place."]].map(([n, h, p]) => <article key={n} className="flow-card"><span>{n}</span><h3>{h}</h3><p>{p}</p><ArrowRight size={18} /></article>)}</div></section>
      <section id="organisations" className="section audience-section"><div className="audience-panel client-panel"><p className="section-kicker">FOR ORGANISATIONS</p><h2>Reliable talent, without the usual search.</h2><p>Build a project team from a skilled, carefully supported professional network.</p><ul>{["Browse verified profiles", "Use a guided AI brief", "Manage delivery in one workspace"].map(x => <li key={x}><Check size={16} />{x}</li>)}</ul><Link href="/app/sign-up" className="text-link">Start a project <ArrowRight size={16} /></Link></div><div id="talent" className="audience-panel talent-panel"><HeartHandshake size={28} /><p className="section-kicker">FOR AFGHAN WOMEN</p><h2>Your skills deserve a global stage.</h2><p>Join a professional community designed around privacy, growth, and fair opportunity.</p><Link href="/app/apply" className="text-link">Apply to join <ArrowRight size={16} /></Link></div></section>
      <section className="section services-section"><div className="section-heading"><p className="section-kicker">WHAT YOU CAN GET DONE</p><h2>Specialist support, ready for real work.</h2></div><div className="service-grid">{services.map(([Icon, title, description]) => { const ServiceIcon = Icon as typeof Code2; return <article key={title as string}><div className="service-icon"><ServiceIcon size={23} /></div><h3>{title as string}</h3><p>{description as string}</p><a href="#organisations">Explore services <ArrowRight size={15} /></a></article>})}</div></section>
      <section id="impact" className="impact-section"><div><p className="section-kicker">IMPACT, BUILT IN</p><h2>{t.impact}</h2><p>{t.impactText}</p><Link href="/about" className="button-light">Our story <ArrowRight size={16} /></Link></div><div className="impact-stats"><div><strong>4</strong><span>professional tracks</span></div><div><strong>1</strong><span>shared purpose</span></div><div><strong>∞</strong><span>potential unlocked</span></div></div></section>
      <section className="final-cta"><div><p className="section-kicker">READY WHEN YOU ARE</p><h2>{t.final}</h2><p>{t.finalText}</p></div><Link href="/app/sign-up" className="button-primary">{t.start} <ArrowRight size={17} /></Link></section>
    </main>
    <footer className="marketing-footer"><Link href="/" className="brand"><Image src="/icon.png" alt="" width={28} height={28} className="rounded-lg" /><span>SheConnects</span></Link><p>Digital work with human impact.</p><div><Link href="/about">About</Link><Link href="/blog">Stories</Link><Link href="/privacy">Privacy</Link></div></footer>
  </div>;
}
