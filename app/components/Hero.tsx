"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="mx-auto max-w-6xl px-4 pt-12 pb-16 lg:flex lg:items-center lg:gap-16"
    >
      <motion.div
        className="lg:flex-1 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-wider text-violet-300">
          Tech for good · Social impact
        </p>
        <h1 className="text-4xl font-semibold leading-tight">
          Remote support with{" "}
          <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            impact
          </span>
          .
        </h1>
        <p className="max-w-xl text-slate-300 text-sm sm:text-base">
          SheConnects is a managed service studio powered by skilled Afghan
          women. We deliver remote support for research, content, and digital
          tasks — fully compliant and impact-driven.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-full bg-violet-500 px-5 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-violet-500/40"
          >
            Request support
          </a>
          <a
            href="#vas"
            className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200"
          >
            Join as a VA
          </a>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 lg:mt-0 lg:flex-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <p className="text-xs text-slate-300 font-medium">Why we exist</p>
          <p className="mt-3 text-slate-200 text-sm">
            Since 2021, hundreds of thousands of Afghan women have lost the
            right to work. SheConnects creates dignified remote opportunities
            by connecting their skills to international organizations.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
