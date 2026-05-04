"use client";

import { motion } from "framer-motion";
import { Code2, Globe, Palette, BarChart3 } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Studio tracks",
    title: "Four specialised studios",
    sub: "Every project is handled by dedicated specialists — no generalists.",
    tracks: [
      {
        icon: Code2, color: "indigo",
        title: "Programming",
        desc: "From web apps to WordPress — full-stack execution, start to finish.",
        bullets: ["Back-end & front-end development", "WordPress development & customisation", "API integration and automation"],
      },
      {
        icon: Globe, color: "amber",
        title: "Document Translation",
        desc: "Precision language work between English and Afghan languages.",
        bullets: ["English ↔ Dari / Farsi / Pashto", "Localisation and cultural adaptation", "Subtitling and transcript services"],
      },
      {
        icon: Palette, color: "purple",
        title: "Creative & Design",
        desc: "Visual work that tells your story — from identity to social content.",
        bullets: ["Graphic design, infographics, presentations", "Branding & visual identity packages", "Social media visuals and templates"],
      },
      {
        icon: BarChart3, color: "teal",
        title: "Research & Data",
        desc: "Insight work that informs better decisions for impact-driven teams.",
        bullets: ["Market research & competitor analysis", "Donor and partner mapping for NGOs", "Data cleaning and structuring"],
      },
    ],
  },
  it: {
    sectionLabel: "Studio track",
    title: "Quattro studi specializzati",
    sub: "Ogni progetto è gestito da specialiste dedicate — nessun generalista.",
    tracks: [
      {
        icon: Code2, color: "indigo",
        title: "Programmazione",
        desc: "Da app web a WordPress — esecuzione full-stack dall'inizio alla fine.",
        bullets: ["Sviluppo back-end e front-end", "WordPress e personalizzazione", "Integrazione API e automazione"],
      },
      {
        icon: Globe, color: "amber",
        title: "Traduzione documenti",
        desc: "Lavoro linguistico preciso tra inglese e lingue afghane.",
        bullets: ["Inglese ↔ Dari / Farsi / Pashto", "Localizzazione e adattamento culturale", "Sottotitolazione e trascrizioni"],
      },
      {
        icon: Palette, color: "purple",
        title: "Creativo & Design",
        desc: "Lavoro visivo che racconta la tua storia.",
        bullets: ["Grafica, infografiche, presentazioni", "Branding e identità visiva", "Visual e template per social"],
      },
      {
        icon: BarChart3, color: "teal",
        title: "Ricerca & Dati",
        desc: "Analisi che supporta decisioni migliori per team ad impatto.",
        bullets: ["Ricerche di mercato e analisi", "Mappatura donatori e partner", "Pulizia e strutturazione dati"],
      },
    ],
  },
};

const palette = {
  indigo: { bar: "bg-indigo-600", icon: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-500", hover: "hover:border-indigo-200 hover:shadow-indigo-100/60" },
  amber:  { bar: "bg-amber-400",  icon: "bg-amber-50  text-amber-600",  dot: "bg-amber-400",  hover: "hover:border-amber-200  hover:shadow-amber-100/60"  },
  purple: { bar: "bg-purple-600", icon: "bg-purple-50 text-purple-600", dot: "bg-purple-500", hover: "hover:border-purple-200 hover:shadow-purple-100/60" },
  teal:   { bar: "bg-teal-500",   icon: "bg-teal-50   text-teal-600",   dot: "bg-teal-500",   hover: "hover:border-teal-200   hover:shadow-teal-100/60"   },
} as const;

type Props = { language: Language };

export default function StudioTracks({ language }: Props) {
  const c = content[language];

  return (
    <section id="services" className="relative overflow-hidden py-28 bg-slate-50">
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute top-0 right-0 rounded-full"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.12, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 rounded-full"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 left-1/4 rounded-full"
        style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, 15, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {c.title}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-slate-500">{c.sub}</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {c.tracks.map((track, i) => {
            const Icon = track.icon;
            const pal = palette[track.color as keyof typeof palette];
            return (
              <motion.article
                key={track.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pal.hover}`}
              >
                {/* Coloured top bar */}
                <div className={`absolute top-0 inset-x-0 h-1 ${pal.bar}`} />

                {/* Icon */}
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${pal.icon}`}>
                  <Icon size={20} className={pal.icon.split(" ")[1]} />
                </div>

                <h3 className="text-lg font-black text-slate-900">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 mb-5">{track.desc}</p>

                <ul className="space-y-2.5">
                  {track.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${pal.dot}`} />
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
