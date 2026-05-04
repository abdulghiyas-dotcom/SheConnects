"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    badge: "Start today",
    title: "Ready to make an impact?",
    sub: "Join the organisations already working with Afghan women professionals — or apply to join our network.",
    cta1: "Start a project",
    cta2: "Join as a freelancer",
  },
  it: {
    badge: "Inizia oggi",
    title: "Pronto a fare la differenza?",
    sub: "Unisciti alle organizzazioni che già lavorano con professioniste afghane — o candidati per far parte della nostra rete.",
    cta1: "Inizia un progetto",
    cta2: "Unisciti come freelancer",
  },
};

type Props = { language: Language };

export default function FinalCtaDark({ language }: Props) {
  const c = content[language];

  return (
    <section id="final-cta" className="py-20 px-4 sm:px-6" style={{ background: "#080810" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-12 text-center sm:p-16"
          style={{
            background: "linear-gradient(135deg, #2d2a8a 0%, #4f46e5 40%, #7c3aed 100%)",
            boxShadow: "0 0 80px rgba(79,70,229,0.4), 0 0 160px rgba(124,58,237,0.2)",
          }}
        >
          {/* Background orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 -left-24 h-72 w-72 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }}
            />
            <div
              className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }}
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative">
            <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/70">
              {c.badge}
            </span>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-indigo-200/80">
              {c.sub}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/app/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {c.cta1}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/app/apply"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Users size={15} />
                {c.cta2}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
