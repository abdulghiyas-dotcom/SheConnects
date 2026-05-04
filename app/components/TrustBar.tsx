"use client";

import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: { label: "Trusted by organisations across Europe" },
  it: { label: "Scelto da organizzazioni in tutta Europa" },
};

const logos = [
  { id: 1, w: 72, label: "NGO A" },
  { id: 2, w: 60, label: "NGO B" },
  { id: 3, w: 80, label: "Foundation C" },
  { id: 4, w: 64, label: "SME D" },
  { id: 5, w: 76, label: "NGO E" },
];

type Props = { language: Language };

export default function TrustBar({ language }: Props) {
  const c = content[language];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-white/[0.05] py-8"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-white/25">
          {c.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-center"
              style={{ width: logo.w }}
            >
              {/* Placeholder logo shape */}
              <div
                className="h-6 rounded-md"
                style={{
                  width: logo.w,
                  background: "rgba(255,255,255,0.06)",
                }}
                aria-label={logo.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
