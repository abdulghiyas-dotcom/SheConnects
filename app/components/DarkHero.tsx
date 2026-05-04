"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    badge: "Tech for Good · Woman-founded · Milan",
    headline1: "Digital work with",
    headline2: "human impact.",
    sub: "We connect Afghan women professionals with European organisations — for ethical, managed, and beautifully delivered remote work.",
    cta1: "Start a project",
    cta2: "Join as a freelancer",
    trust1: "GDPR compliant",
    trust2: "EU-registered",
    trust3: "Vetted professionals",
    stat1n: "150+", stat1l: "Women in our network",
    stat2n: "40+",  stat2l: "Projects delivered",
    stat3l: "SDG 5 — Gender Equality",
  },
  it: {
    badge: "Tech for Good · Fondata da donne · Milano",
    headline1: "Lavoro digitale con",
    headline2: "impatto umano.",
    sub: "Connettiamo professioniste afghane con organizzazioni europee — per un lavoro remoto etico, gestito e di qualità.",
    cta1: "Inizia un progetto",
    cta2: "Unisciti come freelancer",
    trust1: "GDPR compliant",
    trust2: "Azienda UE",
    trust3: "Professioniste verificate",
    stat1n: "150+", stat1l: "Donne nella rete",
    stat2n: "40+",  stat2l: "Progetti consegnati",
    stat3l: "SDG 5 — Uguaglianza di genere",
  },
};

function HeroGraphic({ language }: { language: Language }) {
  const c = content[language];
  return (
    <div className="relative w-full" style={{ height: "560px" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#C7D2FE" />
          </pattern>
          <radialGradient id="indigo-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="amber-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="emerald-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="520" height="520" fill="url(#hero-grid)" />
        <circle cx="286" cy="262" r="210" stroke="#E0E7FF" strokeWidth="1.5" fill="url(#indigo-fill)" />
        <circle cx="286" cy="262" r="158" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="5 10" fill="none" />
        <circle cx="286" cy="262" r="96" stroke="#E0E7FF" strokeWidth="1.5" fill="white" />
        <circle cx="108" cy="400" r="110" fill="url(#amber-fill)" />
        <circle cx="108" cy="400" r="64" stroke="#FDE68A" strokeWidth="1.5" fill="none" />
        <circle cx="430" cy="88" r="72" fill="url(#emerald-fill)" />
        <circle cx="430" cy="88" r="44" stroke="#A7F3D0" strokeWidth="1.5" fill="none" />
        <line x1="200" y1="200" x2="286" y2="262" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 8" />
        <line x1="372" y1="324" x2="430" y2="370" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 8" />
        <line x1="180" y1="330" x2="108" y2="400" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="4" fill="#4F46E5" fillOpacity="0.4" />
        <circle cx="372" cy="324" r="4" fill="#F59E0B" fillOpacity="0.5" />
        <circle cx="180" cy="330" r="4" fill="#F59E0B" fillOpacity="0.4" />
      </svg>

      {/* Animated blob over SVG */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ top: "10%", left: "20%", width: 200, height: 200, background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 20, 0], scale: [1, 1.12, 0.95, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ bottom: "15%", right: "10%", width: 160, height: 160, background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
        animate={{ x: [0, -20, 15, 0], y: [0, 20, -10, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Centre medallion */}
      <div className="absolute" style={{ top: "50%", left: "55%", transform: "translate(-50%, -50%)" }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-indigo-100">
            <Image src="/icon.png" alt="SheConnects" width={52} height={52} className="rounded-2xl" />
          </div>
          <div className="mt-2 rounded-full bg-white px-3 py-1 shadow-md ring-1 ring-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-wide">
            SheConnects
          </div>
        </motion.div>
      </div>

      {/* Floating stat card 1 */}
      <motion.div
        className="absolute right-2 top-10 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xl font-black text-indigo-600">{c.stat1n}</p>
        <p className="text-xs text-slate-500 mt-0.5">{c.stat1l}</p>
      </motion.div>

      {/* Floating stat card 2 */}
      <motion.div
        className="absolute left-0 bottom-20 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <p className="text-xl font-black text-amber-500">{c.stat2n}</p>
        <p className="text-xs text-slate-500 mt-0.5">{c.stat2l}</p>
      </motion.div>

      {/* SDG badge */}
      <motion.div
        className="absolute right-6 bottom-12 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-200 shadow-sm"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <p className="text-[10px] font-semibold text-emerald-700">{c.stat3l}</p>
      </motion.div>

      {/* Live pulse indicator */}
      <motion.div
        className="absolute left-8 top-20 flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 shadow-md"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
        <p className="text-[10px] font-semibold text-white">Live projects</p>
      </motion.div>
    </div>
  );
}

type Props = { language: Language };

export default function Hero({ language }: Props) {
  const c = content[language];

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-28 lg:pb-24" id="hero">
      {/* Animated background gradient blobs */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{ top: "-10%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(238,242,255,0.9) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.08, 1], x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{ bottom: "-5%", left: "-8%", width: 400, height: 400, background: "radial-gradient(circle, rgba(254,243,199,0.6) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.12, 1], x: [0, -10, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT — text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-indigo-600">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {c.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl xl:text-7xl"
            >
              {c.headline1}{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                {c.headline2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500 mx-auto lg:mx-0"
            >
              {c.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link
                href="/app/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {c.cta1}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/app/apply"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5 hover:shadow-md"
              >
                {c.cta2}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2"
            >
              {[c.trust1, c.trust2, c.trust3].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — graphic */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:block"
          >
            <HeroGraphic language={language} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
