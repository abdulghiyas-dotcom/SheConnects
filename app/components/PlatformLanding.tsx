"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, BriefcaseBusiness, Check, CircleDollarSign, HandHeart,
  HeartHandshake, LockKeyhole, Menu, MessagesSquare, ShieldCheck, Sparkles, X,
} from "lucide-react";
import type { Language } from "../lib/translations";

const content = {
  en: {
    nav: ["How it works", "Why it matters", "For teams", "For women"],
    signIn: "Sign in", join: "Work with us",
    eyebrow: "Digital work with human impact",
    title: "The work is real.\nThe opportunity is life-changing.",
    intro: "SheConnects connects organisations with talented Afghan women for exceptional digital work — creating dignified, lasting access to the global economy.",
    hire: "Find your collaborator", apply: "Apply to join", trusted: "Built around privacy, fairness, and real partnership",
    storyKicker: "ONE PROJECT, A WIDER RIPPLE", storyTitle: "When great work travels, opportunity stays.",
    storyText: "A project is more than a deliverable. It can mean independent income, strengthened skills, and a future shaped by choice — while your team gets work it can be proud of.",
    storyPoints: ["Fair, paid professional work", "A privacy-first, supported experience", "Long-term skills and confidence"],
    stepsKicker: "HOW WE MAKE IT WORK", stepsTitle: "Thoughtful matching. Clear collaboration. Shared momentum.",
    steps: [["Tell us what matters", "Share a brief, a challenge, or simply the kind of support you need."], ["Meet a brilliant match", "Connect with a vetted professional whose skills and working style fit."], ["Build something meaningful", "Manage the work in one calm space, with people behind you at every step."]],
    trustKicker: "DESIGNED WITH CARE", trustTitle: "A platform that protects people — and delivers for teams.",
    trust: [["Privacy is foundational", "Women control how they are represented. Personal information stays protected."], ["Quality is human", "Every professional is thoughtfully vetted, supported, and valued for her craft."], ["Partnership over transactions", "Clear briefs, fair terms, and ongoing support make good work possible."], ["Impact you can stand behind", "Your budget supports dignified work, not a promise or a percentage."]],
    audiencesKicker: "TWO SIDES, ONE SHARED PURPOSE", orgTitle: "For organisations", orgText: "Bring skilled capacity into your team and make every project part of a more equitable digital economy.", orgList: ["Explore a vetted talent network", "Get help shaping the right brief", "Keep projects, milestones, and messages together"], orgCta: "Start a project",
    womenTitle: "For Afghan women", womenText: "Your talent belongs in the world. Build experience, earn independently, and work with organisations that value what you bring.", womenCta: "Begin your application",
    closeKicker: "MAKE ROOM FOR POSSIBILITY", closeTitle: "Your next project can do more.", closeText: "Choose exceptional work and help create a future where talented women can be seen, trusted, and paid for what they do best.", closeCta: "Create meaningful work",
    footer: "Work that moves people forward.",
  },
  it: {
    nav: ["Come funziona", "Perché conta", "Per i team", "Per le donne"],
    signIn: "Accedi", join: "Lavora con noi",
    eyebrow: "Lavoro digitale con impatto umano",
    title: "Il lavoro è reale.\nL’opportunità cambia la vita.",
    intro: "SheConnects mette in contatto organizzazioni e donne afghane di talento per un lavoro digitale eccellente, creando un accesso dignitoso e duraturo all’economia globale.",
    hire: "Trova la tua collaboratrice", apply: "Candidati", trusted: "Privacy, equità e partnership reale al centro",
    storyKicker: "UN PROGETTO, UN EFFETTO PIÙ AMPIO", storyTitle: "Quando il buon lavoro viaggia, l’opportunità resta.",
    storyText: "Un progetto è più di una consegna. Può significare reddito indipendente, competenze più solide e un futuro scelto in autonomia, mentre il tuo team riceve un lavoro di cui essere orgoglioso.",
    storyPoints: ["Lavoro professionale, equo e retribuito", "Un’esperienza supportata e attenta alla privacy", "Competenze e fiducia nel lungo periodo"],
    stepsKicker: "COME FUNZIONA", stepsTitle: "Matching attento. Collaborazione chiara. Slancio condiviso.",
    steps: [["Raccontaci cosa conta", "Condividi un brief, una sfida o il tipo di supporto che ti serve."], ["Incontra il match giusto", "Connettiti con una professionista selezionata per competenze e stile di lavoro."], ["Costruite qualcosa di significativo", "Gestisci il lavoro in uno spazio semplice, con persone pronte a supportarti."],],
    trustKicker: "PROGETTATO CON CURA", trustTitle: "Una piattaforma che protegge le persone e fa crescere i team.",
    trust: [["La privacy è fondamentale", "Ogni donna controlla come viene rappresentata. I dati personali restano protetti."], ["La qualità è umana", "Ogni professionista è selezionata, supportata e valorizzata per il suo lavoro."], ["Partnership, non transazioni", "Brief chiari, condizioni eque e supporto continuo rendono possibile un buon lavoro."], ["Un impatto concreto", "Il tuo budget sostiene lavoro dignitoso, non una promessa o una percentuale."],],
    audiencesKicker: "DUE PARTI, UNO SCOPO CONDIVISO", orgTitle: "Per le organizzazioni", orgText: "Aggiungi competenze al tuo team e rendi ogni progetto parte di un’economia digitale più equa.", orgList: ["Esplora una rete di talenti selezionati", "Ricevi aiuto per definire il brief", "Tieni insieme progetti, milestone e messaggi"], orgCta: "Inizia un progetto",
    womenTitle: "Per le donne afghane", womenText: "Il tuo talento ha spazio nel mondo. Fai esperienza, guadagna in autonomia e lavora con organizzazioni che valorizzano ciò che porti.", womenCta: "Inizia la candidatura",
    closeKicker: "FAI SPAZIO ALLE POSSIBILITÀ", closeTitle: "Il tuo prossimo progetto può fare di più.", closeText: "Scegli un lavoro eccellente e contribuisci a un futuro in cui le donne di talento siano viste, credute e retribuite per ciò che sanno fare.", closeCta: "Crea lavoro significativo",
    footer: "Lavoro che fa avanzare le persone.",
  },
} as const;

const icons = [BriefcaseBusiness, Sparkles, MessagesSquare];
const trustIcons = [LockKeyhole, ShieldCheck, HeartHandshake, CircleDollarSign];

export default function PlatformLanding({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage === "it" ? "it" : "en");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[language];
  const anchors = ["#how-it-works", "#why-it-matters", "#for-teams", "#for-women"];

  useEffect(() => { document.cookie = `lang=${language}; path=/; max-age=31536000`; }, [language]);

  return (
    <div className="impact-site">
      <header className="impact-nav">
        <Link href="/" className="impact-brand"><Image src="/icon.png" alt="SheConnects" width={34} height={34} /><span>SheConnects</span></Link>
        <nav className="impact-nav-links">{t.nav.map((item, index) => <a href={anchors[index]} key={item}>{item}</a>)}</nav>
        <div className="impact-nav-actions"><div className="impact-language"><button onClick={() => setLanguage("en")} className={language === "en" ? "selected" : ""}>EN</button><button onClick={() => setLanguage("it")} className={language === "it" ? "selected" : ""}>IT</button></div><Link href="/app/sign-in" className="impact-signin">{t.signIn}</Link><Link href="/app/sign-up" className="impact-nav-cta">{t.join}</Link></div>
        <button className="impact-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <div className="impact-mobile-menu">{t.nav.map((item, index) => <a href={anchors[index]} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}<Link href="/app/sign-in">{t.signIn}</Link><Link href="/app/sign-up" className="impact-nav-cta">{t.join}</Link></div>}
      </header>

      <main>
        <section className="impact-hero">
          <div className="impact-hero-copy"><p className="impact-overline"><HandHeart size={15} /> {t.eyebrow}</p><h1>{t.title.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1><p className="impact-hero-intro">{t.intro}</p><div className="impact-hero-actions"><Link href="/app/sign-up" className="impact-button-primary">{t.hire}<ArrowRight size={17} /></Link><Link href="/app/apply" className="impact-button-secondary">{t.apply}</Link></div><p className="impact-hero-proof"><Check size={15} />{t.trusted}</p></div>
          <div className="impact-hero-art" aria-label="A visual representation of collaboration and opportunity"><div className="impact-sun" /><div className="impact-line line-one" /><div className="impact-line line-two" /><div className="impact-person person-one"><span>SK</span><small>Creative</small></div><div className="impact-person person-two"><span>ZN</span><small>Language</small></div><div className="impact-person person-three"><span>FR</span><small>Research</small></div><div className="impact-connection"><HeartHandshake size={21} /><span>Meaningful collaboration</span></div><div className="impact-art-note"><Sparkles size={15} /><span>Skills that travel far</span></div></div>
        </section>

        <section id="why-it-matters" className="impact-story"><div className="impact-story-aside"><p>{t.storyKicker}</p><span className="impact-story-mark">↗</span></div><div><h2>{t.storyTitle}</h2><p className="impact-story-text">{t.storyText}</p><div className="impact-story-list">{t.storyPoints.map(point => <div key={point}><Check size={17} /><span>{point}</span></div>)}</div></div></section>

        <section id="how-it-works" className="impact-steps"><div className="impact-section-heading"><p>{t.stepsKicker}</p><h2>{t.stepsTitle}</h2></div><div className="impact-step-grid">{t.steps.map(([title, description], index) => { const Icon = icons[index]; return <article key={title}><div className="impact-step-icon"><Icon size={22} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>})}</div></section>

        <section className="impact-trust"><div className="impact-section-heading"><p>{t.trustKicker}</p><h2>{t.trustTitle}</h2></div><div className="impact-trust-grid">{t.trust.map(([title, description], index) => { const Icon = trustIcons[index]; return <article key={title}><Icon size={21} /><h3>{title}</h3><p>{description}</p></article>})}</div></section>

        <section className="impact-audiences"><p className="impact-audience-overline">{t.audiencesKicker}</p><div className="impact-audience-grid"><article id="for-teams" className="impact-audience-card impact-team-card"><BriefcaseBusiness size={30} /><h2>{t.orgTitle}</h2><p>{t.orgText}</p><ul>{t.orgList.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul><Link href="/app/sign-up">{t.orgCta}<ArrowRight size={16} /></Link></article><article id="for-women" className="impact-audience-card impact-women-card"><HeartHandshake size={31} /><h2>{t.womenTitle}</h2><p>{t.womenText}</p><Link href="/app/apply">{t.womenCta}<ArrowRight size={16} /></Link></article></div></section>

        <section className="impact-close"><div><p>{t.closeKicker}</p><h2>{t.closeTitle}</h2><span>{t.closeText}</span></div><Link href="/app/sign-up" className="impact-button-light">{t.closeCta}<ArrowRight size={17} /></Link></section>
      </main>
      <footer className="impact-footer"><Link href="/" className="impact-brand"><Image src="/icon.png" alt="" width={30} height={30} /><span>SheConnects</span></Link><p>{t.footer}</p><div><Link href="/about">About</Link><Link href="/blog">Stories</Link><Link href="/privacy">Privacy</Link></div></footer>
    </div>
  );
}
