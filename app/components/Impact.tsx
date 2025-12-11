"use client";

import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";

type ImpactProps = {
  content: SiteContent["impact"];
};

export default function Impact({ content }: ImpactProps) {
  return (
    <section
      id="impact"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {content.stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-violet-100 bg-white p-6 text-center shadow-sm shadow-violet-50"
          >
            <p className="text-3xl font-semibold text-violet-700 sm:text-4xl">
              {item.number}
            </p>
            <h3 className="mt-1 text-sm font-medium text-slate-800">
              {item.label}
            </h3>
            <p className="mt-2 text-xs text-slate-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
