"use client";
import { motion } from "framer-motion";

export default function ForOrganizations() {
  const items = [
    {
      t: "Ethical, impact-first outsourcing",
      d: "Every project supports Afghan women.",
    },
    {
      t: "Managed & compliant",
      d: "We are your contractual partner.",
    },
    {
      t: "Aligned time zones",
      d: "Smooth communication with Europe.",
    },
    {
      t: "Vetted talent",
      d: "Professionals with NGO & admin experience.",
    },
  ];
  return (
    <section
      id="organizations"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          For organizations across Europe
        </h2>
      </motion.div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((it, i) => (
          <motion.article
            key={it.t}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-sm font-semibold text-slate-50">{it.t}</h3>
            <p className="mt-2 text-xs text-slate-300">{it.d}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
