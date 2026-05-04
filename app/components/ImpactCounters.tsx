"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Our impact",
    title: "Numbers behind the mission",
    stats: [
      { number: 150, suffix: "+", label: "Women in our network",    desc: "Applications from talented women across Afghanistan." },
      { number: 40,  suffix: "+", label: "Projects delivered",      desc: "Successfully completed for NGOs and social enterprises." },
      { number: 12,  suffix: "+", label: "Organisations served",    desc: "European NGOs, SMEs, and foundations we've partnered with." },
      { number: 8,   suffix: "+", label: "Countries reached",       desc: "Active client presence across Europe and beyond." },
    ],
  },
  it: {
    sectionLabel: "Il nostro impatto",
    title: "I numeri dietro la missione",
    stats: [
      { number: 150, suffix: "+", label: "Donne nella rete",             desc: "Candidature da donne talentuose in tutta l'Afghanistan." },
      { number: 40,  suffix: "+", label: "Progetti consegnati",          desc: "Completati con successo per ONG e imprese sociali." },
      { number: 12,  suffix: "+", label: "Organizzazioni servite",       desc: "ONG, PMI e fondazioni europee con cui abbiamo collaborato." },
      { number: 8,   suffix: "+", label: "Paesi raggiunti",              desc: "Presenza attiva dei clienti in Europa e oltre." },
    ],
  },
};

function Counter({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    const steps = 50;
    const interval = 1400 / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      setVal(Math.round((1 - Math.pow(1 - step / steps, 3)) * target));
      if (step >= steps) { clearInterval(t); setVal(target); }
    }, interval);
    return () => clearInterval(t);
  }, [started, target]);
  return <>{val}{suffix}</>;
}

type Props = { language: Language };

export default function ImpactCounters({ language }: Props) {
  const c = content[language];
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="impact"
      ref={ref}
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, #4338CA 0%, #4F46E5 45%, #7C3AED 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* White blob top-right */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-200">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{c.title}</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-sm"
            >
              <p className="text-4xl font-black tracking-tight text-white">
                <Counter target={stat.number} suffix={stat.suffix} started={started} />
              </p>
              <p className="mt-2 text-sm font-semibold text-indigo-200">{stat.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-indigo-300/70">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
