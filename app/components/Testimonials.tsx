"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    q: "Working with SheConnects felt like an extension of our own team.",
    n: "Program Manager, European NGO",
  },
  {
    q: "Before SheConnects, I thought my career was over.",
    n: "S., Virtual Assistant",
  },
  {
    q: "The model is simple and compliant: one contract, one partner.",
    n: "Director, Social Enterprise",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Stories from both sides
        </h2>
      </motion.div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={i}
            className="rounded-2xl border border-violet-50 bg-gradient-to-br from-white to-slate-50 p-4 text-sm shadow-sm shadow-violet-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-xs text-slate-800">“{t.q}”</p>
            <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
              {t.n}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
