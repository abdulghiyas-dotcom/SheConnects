"use client";
import { motion } from "framer-motion";

const steps = [
  "Share your needs",
  "We design your support package",
  "Delivery through SheConnects",
  "Impact & performance reports",
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How partnering with SheConnects works
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
            <div className="h-7 w-7 rounded-full bg-violet-500 text-slate-950 flex items-center justify-center text-xs font-semibold">
              {i + 1}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-50">{s}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
