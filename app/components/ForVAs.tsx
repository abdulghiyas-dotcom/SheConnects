"use client";
import { motion } from "framer-motion";

export default function ForVAs() {
  const steps = [
    "Apply online",
    "Training & onboarding",
    "Work through SheConnects",
    "Earn with support",
  ];
  return (
    <section
      id="vas"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Afghan women: build your remote career with us
        </h2>
      </motion.div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-sm font-semibold text-slate-50">{s}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
