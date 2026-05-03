"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";

type ImpactProps = {
  content: SiteContent["impact"];
};

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1200;
        const steps = 40;
        const stepTime = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * numericPart);
          setDisplayed(current + suffix);
          if (step >= steps) {
            clearInterval(timer);
            setDisplayed(value);
          }
        }, stepTime);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, numericPart, suffix]);

  return <span ref={ref}>{displayed}</span>;
}

export default function Impact({ content }: ImpactProps) {
  return (
    <section id="impact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block rounded-full bg-trust-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-trust-700 mb-4">
          Impact
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500">
          {content.subtitle}
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-3">
        {content.stats.map((item, index) => (
          <motion.div
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand-50 opacity-60" />
            <p className="relative text-5xl font-extrabold tracking-tight text-brand-600">
              <AnimatedNumber value={item.number} />
            </p>
            <h3 className="relative mt-2 text-base font-semibold text-slate-800">
              {item.label}
            </h3>
            <p className="relative mt-2 text-sm text-slate-500 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
