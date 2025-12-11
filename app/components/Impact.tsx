"use client";

import { motion } from "framer-motion";

export default function Impact() {
  const stats = [
    {
      number: "150+",
      label: "Applications received",
      description:
        "Talented women from across Afghanistan expressed interest in joining SheConnects.",
    },
    {
      number: "40+",
      label: "Interviews completed",
      description:
        "Rigorous screening to understand technical skills, communication, and project readiness.",
    },
    {
      number: "20",
      label: "Women selected & trained",
      description:
        "A cohort of motivated professionals trained to deliver digital and creative services internationally.",
    },
  ];

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
          Measurable impact for Afghan women
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base max-w-2xl mx-auto">
          Through careful screening, capability-building, and a managed workflow, SheConnects
          supports Afghan women in gaining dignified, remote-friendly professional opportunities.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {stats.map((item, index) => (
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
