"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-3xl border border-violet-100 bg-white/90 px-4 pt-12 pb-16 shadow-[0_25px_80px_rgba(99,102,241,0.08)] lg:flex lg:items-center lg:gap-16 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-14 -top-10 h-48 w-48 rounded-full bg-violet-200 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-fuchsia-200 blur-3xl" />
      </div>
      <motion.div
        className="lg:flex-1 space-y-6 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-700 ring-1 ring-violet-100">
          Tech for good · woman-founed
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Remote support with{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            impact
          </span>
          .
        </h1>
        <p className="max-w-xl text-sm text-slate-700 sm:text-base">
          SheConnects is a managed service studio powered by skilled Afghan
          women. We deliver remote support for research, content, and digital
          tasks — fully compliant and impact-driven.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            Request support
          </a>
          <a
            href="#vas"
            className="rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            Join as a VA
          </a>
        </div>
      </motion.div>

      <motion.div
        className="relative mt-8 lg:mt-0 lg:flex-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6 shadow-xl shadow-violet-100">
          <p className="text-xs font-semibold text-violet-700">Why we exist</p>
          <p className="mt-3 text-sm text-slate-700">
            Since 2021, hundreds of thousands of Afghan women have lost the
            right to work. SheConnects creates dignified remote opportunities
            by connecting their skills to international organizations.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
