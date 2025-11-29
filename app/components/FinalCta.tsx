"use client";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to turn your next project into impact?
        </h2>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">
          Partner with SheConnects for your research, content, or digital
          support.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <a
            href="#contact"
            className="rounded-full bg-violet-500 px-5 py-2 text-slate-950 text-sm font-medium"
          >
            Request support
          </a>
          <a
            href="#vas"
            className="rounded-full border border-slate-700 px-5 py-2 text-slate-100 text-sm"
          >
            Join as a VA
          </a>
        </div>
      </motion.div>
    </section>
  );
}
