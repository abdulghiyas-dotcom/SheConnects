"use client";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        className="grid gap-8 md:grid-cols-[1.5fr,2fr]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let&apos;s explore how we can work together
          </h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Share a bit about your organization and the support you&apos;re
            looking for.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Prefer email?{" "}
            <a
              href="mailto:hello@sheconnects.work"
              className="underline underline-offset-2"
            >
              hello@sheconnects.work
            </a>
          </p>
        </div>
        <form
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="w-full rounded-md p-2 mb-2 bg-slate-950 border border-slate-700 text-slate-100 text-sm"
            placeholder="Full name"
          />
          <input
            className="w-full rounded-md p-2 mb-2 bg-slate-950 border border-slate-700 text-slate-100 text-sm"
            placeholder="Organization"
          />
          <input
            type="email"
            className="w-full rounded-md p-2 mb-2 bg-slate-950 border border-slate-700 text-slate-100 text-sm"
            placeholder="you@org.org"
          />
          <textarea
            className="w-full rounded-md p-2 mb-2 bg-slate-950 border border-slate-700 text-slate-100 text-sm"
            rows={3}
            placeholder="Short description"
          />
          <button
            className="w-full rounded-full bg-violet-500 py-2 text-slate-950 text-sm font-medium"
          >
            Submit (demo)
          </button>
        </form>
      </motion.div>
    </section>
  );
}
