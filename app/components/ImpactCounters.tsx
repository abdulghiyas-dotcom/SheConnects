"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Our impact",
    title: "Numbers that matter",
    stats: [
      { number: 150, suffix: "+", label: "Women supported", desc: "Applications from talented women across Afghanistan." },
      { number: 40, suffix: "+", label: "Projects delivered", desc: "Successfully completed for NGOs and social enterprises." },
      { number: 12, suffix: "+", label: "Organisations served", desc: "European NGOs, SMEs, and foundations we've partnered with." },
      { number: 8, suffix: "+", label: "Countries reached", desc: "Active client presence across Europe and beyond." },
    ],
  },
  it: {
    sectionLabel: "Il nostro impatto",
    title: "Numeri che contano",
    stats: [
      { number: 150, suffix: "+", label: "Donne supportate", desc: "Candidature da donne talentuose in tutta l'Afghanistan." },
      { number: 40, suffix: "+", label: "Progetti consegnati", desc: "Completati con successo per ONG e imprese sociali." },
      { number: 12, suffix: "+", label: "Organizzazioni servite", desc: "ONG, PMI e fondazioni europee con cui abbiamo collaborato." },
      { number: 8, suffix: "+", label: "Paesi raggiunti", desc: "Presenza attiva dei clienti in Europa e oltre." },
    ],
  },
};

function AnimatedCounter({
  target,
  suffix,
  started,
}: {
  target: number;
  suffix: string;
  started: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (step >= steps) { clearInterval(timer); setValue(target); }
    }, interval);

    return () => clearInterval(timer);
  }, [started, target]);

  return <span>{value}{suffix}</span>;
}

type Props = { language: Language };

export default function ImpactCounters({ language }: Props) {
  const c = content[language];
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="impact"
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{ background: "#0a0a18" }}
    >
      {/* Top gradient border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(79,70,229,0.4), rgba(124,58,237,0.4), transparent)" }}
      />
      {/* Bottom gradient border */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(79,70,229,0.4), rgba(124,58,237,0.4), transparent)" }}
      />

      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-400">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {c.title}
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-white/6 p-7 text-center"
              style={{ background: "#0F0F1A" }}
            >
              <p className="text-5xl font-black tracking-tight text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text mb-2">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} started={started} />
              </p>
              <p className="text-sm font-semibold text-white mb-2">{stat.label}</p>
              <p className="text-xs leading-relaxed text-white/35">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
