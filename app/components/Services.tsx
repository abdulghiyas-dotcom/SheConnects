"use client";
import { motion } from "framer-motion";

const services = [
  {
    title: "Programming",
    bullets: [
      "Back-end and front-end development",
      "WordPress development and customization",
    ],
  },
  {
    title: "Document Translation",
    bullets: [
      "Translation between English ↔ Dari/Farsi/Pashto",
      "Localization and cultural adaptation of materials",
      "Subtitling and transcript services for NGOs and media",
    ],
  },
  {
    title: "Creative & Design",
    bullets: [
      "Graphic design (posters, infographics, presentations)",
      "Branding & visual identity packages",
      "Social media visuals and templates",
      "Canva / Adobe-based design production",
      "video editing for campaigns and storytelling",
    ],
  },
  {
    title: "Research & Data Studio",
    bullets: [
      "Market research & competitor analysis",
      "Donor and partner mapping (for NGOs)",
      "Desk-based studies and literature reviews",
      "Data cleaning and structuring for reports",
    ],
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
          These are our core studio capabilities – programming, translation,
          creative production, and research. We also regularly design{" "}
          <span className="font-medium">
            custom support packages based on the specific needs
          </span>{" "}
          of NGOs, social enterprises, and impact-driven teams.
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

      {/* Custom services callout */}
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">
            Need something different?
          </span>{" "}
          Many of our collaborations start with a unique request – from data
          clean-up to long-form reports or ongoing support.{" "}
          <a
            href="#contact"
            className="font-medium text-violet-700 underline underline-offset-2"
          >
            Tell us what you need
          </a>{" "}
          and we&apos;ll shape a custom support model for your team.
        </p>
      </div>
    </section>
  );
}
