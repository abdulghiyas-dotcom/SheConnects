"use client";
import { motion } from "framer-motion";

const services = [
  {
    title: "Research & insights",
    bullets: ["Market research", "Contact lists", "Policy briefs"],
  },
  {
    title: "Content & presentation support",
    bullets: ["Slide decks", "Info sheets", "Light editing"],
  },
  {
    title: "Digital & back-office support",
    bullets: ["Data entry", "CMS updates", "Templates"],
  },
  {
    title: "Translation & localization",
    bullets: ["Dari/Farsi/Pashto ↔ English", "Localization", "Glossaries"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What we deliver
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          Managed, ethical remote support for NGOs, social enterprises, and
          mission-driven teams.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            className="rounded-2xl border border-violet-50 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm shadow-violet-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {s.title}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {s.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
