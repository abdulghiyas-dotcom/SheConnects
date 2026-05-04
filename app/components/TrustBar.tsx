"use client";

import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: { label: "Trusted by organisations across Europe" },
  it: { label: "Scelto da organizzazioni in tutta Europa" },
};

const logos = [
  { w: 72 }, { w: 60 }, { w: 84 }, { w: 66 }, { w: 78 },
];

type Props = { language: Language };

export default function TrustBar({ language }: Props) {
  const c = content[language];
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-7 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400"
        >
          {c.label}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="h-7 rounded-lg bg-slate-200/70"
              style={{ width: logo.w }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
