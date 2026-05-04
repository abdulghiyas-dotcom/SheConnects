"use client";

import { motion } from "framer-motion";
import { Code2, Globe, Palette, BarChart3 } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Studio tracks",
    title: "Four specialised studios",
    sub: "Every project is handled by specialists — no generalists, no shortcuts.",
    tracks: [
      {
        icon: Code2,
        color: "indigo",
        title: "Programming",
        desc: "From web apps to WordPress — full-stack execution handled end to end.",
        bullets: ["Back-end and front-end development", "WordPress development and customisation", "API integration & automation"],
      },
      {
        icon: Globe,
        color: "amber",
        title: "Document Translation",
        desc: "Precision language work between English and Afghan languages.",
        bullets: ["English ↔ Dari / Farsi / Pashto", "Localisation and cultural adaptation", "Subtitling and transcript services"],
      },
      {
        icon: Palette,
        color: "purple",
        title: "Creative & Design",
        desc: "Visual work that tells your story — from identity to social content.",
        bullets: ["Graphic design, infographics, presentations", "Branding & visual identity", "Social media visuals and templates"],
      },
      {
        icon: BarChart3,
        color: "teal",
        title: "Research & Data",
        desc: "Insight work that informs better decisions for impact-driven teams.",
        bullets: ["Market research & competitor analysis", "Donor and partner mapping", "Data cleaning and structuring"],
      },
    ],
  },
  it: {
    sectionLabel: "Studio track",
    title: "Quattro studi specializzati",
    sub: "Ogni progetto è gestito da specialisti — nessun generalista, nessuna scorciatoia.",
    tracks: [
      {
        icon: Code2,
        color: "indigo",
        title: "Programmazione",
        desc: "Da app web a WordPress — esecuzione full-stack gestita dall'inizio alla fine.",
        bullets: ["Sviluppo back-end e front-end", "Sviluppo e personalizzazione WordPress", "Integrazione API e automazione"],
      },
      {
        icon: Globe,
        color: "amber",
        title: "Traduzione documenti",
        desc: "Lavoro linguistico preciso tra inglese e lingue afghane.",
        bullets: ["Inglese ↔ Dari / Farsi / Pashto", "Localizzazione e adattamento culturale", "Sottotitolazione e trascrizioni"],
      },
      {
        icon: Palette,
        color: "purple",
        title: "Creativo & Design",
        desc: "Lavoro visivo che racconta la tua storia — dall'identità ai contenuti social.",
        bullets: ["Grafica, infografiche, presentazioni", "Branding e identità visiva", "Visual e template per social media"],
      },
      {
        icon: BarChart3,
        color: "teal",
        title: "Ricerca & Dati",
        desc: "Analisi che supporta decisioni migliori per team ad impatto.",
        bullets: ["Ricerche di mercato e analisi della concorrenza", "Mappatura di donatori e partner", "Pulizia e strutturazione dei dati"],
      },
    ],
  },
};

const colorMap = {
  indigo: {
    icon: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border border-indigo-500/20",
    dot: "bg-indigo-500",
    glow: "rgba(79,70,229,0.12)",
    border: "rgba(79,70,229,0.2)",
  },
  amber: {
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    dot: "bg-amber-500",
    glow: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  purple: {
    icon: "text-purple-400",
    iconBg: "bg-purple-500/10 border border-purple-500/20",
    dot: "bg-purple-500",
    glow: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.2)",
  },
  teal: {
    icon: "text-teal-400",
    iconBg: "bg-teal-500/10 border border-teal-500/20",
    dot: "bg-teal-500",
    glow: "rgba(20,184,166,0.1)",
    border: "rgba(20,184,166,0.2)",
  },
} as const;

type Props = { language: Language };

export default function StudioTracks({ language }: Props) {
  const c = content[language];

  return (
    <section id="services" className="py-28" style={{ background: "#080810" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-400">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {c.title}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-white/40">
            {c.sub}
          </p>
        </motion.div>

        {/* Bento 2×2 grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {c.tracks.map((track, i) => {
            const Icon = track.icon;
            const colors = colorMap[track.color as keyof typeof colorMap];

            return (
              <motion.article
                key={track.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border p-7 transition-all duration-300"
                style={{
                  background: "#0F0F1A",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${colors.glow}, inset 0 0 40px ${colors.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${colors.iconBg}`}>
                  <Icon size={20} className={colors.icon} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{track.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{track.desc}</p>

                <ul className="space-y-2">
                  {track.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/55">
                      <span className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${colors.dot}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
