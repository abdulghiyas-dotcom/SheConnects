"use client";

import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { Code2, Palette, Globe, BarChart3 } from "lucide-react";

type ServicesProps = {
  content: SiteContent["services"];
};

const trackIcons = [Code2, Globe, Palette, BarChart3];
const trackColors = [
  { bg: "bg-brand-50", border: "border-brand-100", icon: "text-brand-600", dot: "bg-brand-600" },
  { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-600", dot: "bg-amber-600" },
  { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-600", dot: "bg-violet-600" },
  { bg: "bg-teal-50", border: "border-teal-100", icon: "text-teal-600", dot: "bg-teal-600" },
];

export default function Services({ content }: ServicesProps) {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 mb-4">
          Studio tracks
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500">
          {content.description}
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {content.items.map((s, i) => {
          const Icon = trackIcons[i] ?? Code2;
          const colors = trackColors[i] ?? trackColors[0];
          return (
            <motion.article
              key={s.title}
              className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm`}>
                <Icon size={20} className={colors.icon} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${colors.dot}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>

      <motion.div
        className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-slate-700 flex-1">
          <span className="font-semibold text-slate-900">{content.customPrompt}</span>
        </p>
        <a
          href="#contact"
          className="flex-shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-brand hover:bg-brand-700 transition-colors"
        >
          {content.customCta}
        </a>
      </motion.div>
    </section>
  );
}
