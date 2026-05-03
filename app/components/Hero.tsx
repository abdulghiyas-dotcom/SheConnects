"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

type HeroProps = {
  content: SiteContent["hero"];
  common: SiteContent["common"];
};

export default function Hero({ content, common }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-slate-900"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)" }}
    >
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center lg:justify-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-300 backdrop-blur-sm">
            <Sparkles size={11} className="text-accent-400" />
            {content.badge}
          </span>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left — headline + CTAs */}
          <div>
            <motion.h1
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {content.title}{" "}
              <span className="bg-gradient-to-r from-brand-300 to-violet-300 bg-clip-text text-transparent">
                {content.highlight}
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {content.description}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/app/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-brand-lg transition-all hover:bg-brand-500 hover:-translate-y-0.5"
              >
                {common.requestSupport}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/freelancers"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-0.5"
              >
                {common.joinFreelancer}
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-trust-400" />
                GDPR compliant
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-trust-400" />
                EU-registered company
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-trust-400" />
                Vetted professionals
              </span>
            </motion.div>
          </div>

          {/* Right — mission card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-300 mb-4">
                {content.whyTitle}
              </p>
              <p className="text-base leading-relaxed text-slate-200">
                {content.whyDescription}
              </p>

              {/* Stats mini-row */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  { n: "150+", l: "Applications" },
                  { n: "40+", l: "Interviews" },
                  { n: "20", l: "Active" },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <p className="text-xl font-bold text-white">{n}</p>
                    <p className="text-[11px] text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-trust-500/30 bg-trust-500/20 px-3 py-2 backdrop-blur-sm hidden lg:block">
              <p className="text-xs font-semibold text-trust-300">SDG 5 — Gender Equality</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
