"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    badge: "Start today — it's free",
    title: "Ready to make an impact?",
    sub: "Join organisations already working with Afghan women professionals, or apply to build your remote career.",
    cta1: "Start a project",
    cta2: "Apply as a freelancer",
  },
  it: {
    badge: "Inizia oggi — è gratuito",
    title: "Pronta a fare la differenza?",
    sub: "Unisciti alle organizzazioni che lavorano con professioniste afghane, o candidati per costruire la tua carriera da remoto.",
    cta1: "Inizia un progetto",
    cta2: "Candidati come freelancer",
  },
};

type Props = { language: Language };

export default function FinalCta({ language }: Props) {
  const c = content[language];

  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center sm:px-16"
        >
          {/* Background: grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Background: animated orbs */}
          <motion.div
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl"
            animate={{ scale: [1, 1.25, 1], x: [0, 25, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />

          <div className="relative">
            <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/80">
              {c.badge}
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{c.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-indigo-200">{c.sub}</p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/app/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {c.cta1}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/app/apply"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
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
