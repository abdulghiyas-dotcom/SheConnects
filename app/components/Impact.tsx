"use client";
import { motion } from "framer-motion";

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
      <p className="text-slate-300 text-xs">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}

export default function Impact() {
  return (
    <section
      id="impact"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Measurable impact for Afghan women
        </h2>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">
          Every project through SheConnects creates dignified remote work
          opportunities.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card label="Women supported" value="—" />
        <Card label="Hours of remote work" value="—" />
        <Card label="€ income enabled" value="—" />
      </div>
    </section>
  );
}
