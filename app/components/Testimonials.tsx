"use client";

import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";

type TestimonialsProps = {
  content: SiteContent["testimonials"];
};

const accentColors = ["brand", "accent", "trust"] as const;
type Accent = typeof accentColors[number];

const accentBg: Record<Accent, string> = {
  brand:  "bg-brand-50 border-brand-100",
  accent: "bg-accent-50 border-amber-100",
  trust:  "bg-trust-50 border-trust-100",
};

const accentQuote: Record<Accent, string> = {
  brand:  "text-brand-200",
  accent: "text-accent-200",
  trust:  "text-trust-200",
};

const accentAuthor: Record<Accent, string> = {
  brand:  "text-brand-700",
  accent: "text-accent-700",
  trust:  "text-trust-700",
};

export default function Testimonials({ content }: TestimonialsProps) {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4">
          Stories
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {content.items.map((t, i) => {
          const accent = accentColors[i % accentColors.length];
          return (
            <motion.figure
              key={i}
              className={`rounded-2xl border p-7 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 ${accentBg[accent]}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`text-6xl font-serif leading-none mb-3 ${accentQuote[accent]}`}>&ldquo;</div>
              <blockquote className="text-sm leading-relaxed text-slate-700">
                {t.quote}
              </blockquote>
              <figcaption className={`mt-5 text-[11px] font-bold uppercase tracking-widest ${accentAuthor[accent]}`}>
                — {t.author}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}
