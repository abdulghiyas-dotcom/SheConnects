"use client";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6 text-center shadow-lg shadow-violet-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to turn your next project into impact?
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          Partner with SheConnects for your research, content, or digital
          support.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <a
            href="#contact"
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-violet-200"
          >
            Request support
          </a>
          <a
            href="#vas"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-800 shadow-sm"
          >
            Join as a Freelancer
          </a>
        </div>
      </motion.div>
    </section>
  );
}
