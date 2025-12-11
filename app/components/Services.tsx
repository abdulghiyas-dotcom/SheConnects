"use client";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";

type ServicesProps = {
  content: SiteContent["services"];
};

export default function Services({ content }: ServicesProps) {
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
          {content.title}
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          {content.description}
        </p>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {content.items.map((s, i) => (
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

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">
            {content.customPrompt}
          </span>{" "}
          <a
            href="#contact"
            className="font-medium text-violet-700 underline underline-offset-2"
          >
            {content.customCta}
          </a>
        </p>
      </div>
    </section>
  );
}
