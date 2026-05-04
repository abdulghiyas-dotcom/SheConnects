"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    badge: "Tech for Good · Impact-driven",
    line1: "Digital work with",
    line2: "human impact",
    sub: "SheConnects connects Afghan women professionals with European organisations — for ethical, vetted, and beautifully managed remote work.",
    cta1: "Start a project",
    cta2: "Join as a freelancer",
    scroll: "Scroll to explore",
  },
  it: {
    badge: "Tech for Good · Impatto umano",
    line1: "Lavoro digitale con",
    line2: "impatto umano",
    sub: "SheConnects connette professioniste afghane con organizzazioni europee — per lavoro remoto etico, verificato e gestito con cura.",
    cta1: "Inizia un progetto",
    cta2: "Unisciti come freelancer",
    scroll: "Scorri per scoprire",
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

type Props = { language: Language };

export default function DarkHero({ language }: Props) {
  const c = content[language];
  const line1Words = c.line1.split(" ");
  const line2Words = c.line2.split(" ");
  const allWords = [...line1Words, ...line2Words];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-24 text-center"
      style={{ background: "#080810" }}
    >
      {/* Background glow blobs */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(79,70,229,0.18) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "5%",
          right: "5%",
          width: "360px",
          height: "360px",
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: "20%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.02,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {c.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="block overflow-hidden pb-2">
            {line1Words.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="mr-[0.28em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block overflow-hidden pb-2">
            {line2Words.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                custom={line1Words.length + i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="mr-[0.28em] inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + allWords.length * 0.1 }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg"
        >
          {c.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 + allWords.length * 0.1 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/app/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-neon active:translate-y-0"
            style={{ boxShadow: "0 0 24px rgba(79,70,229,0.4)" }}
          >
            {c.cta1}
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/app/apply"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
          >
            {c.cta2}
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 + allWords.length * 0.1 }}
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/30"
        >
          <span>GDPR compliant</span>
          <span className="text-white/15">·</span>
          <span>EU-registered company</span>
          <span className="text-white/15">·</span>
          <span>Vetted professionals</span>
          <span className="text-white/15">·</span>
          <span>SDG 5 aligned</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/25">{c.scroll}</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
