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
          <p className="mt-2 text-sm text-slate-700 sm:text-base">
            Share a bit about your organization and the support you&apos;re
            looking for.
          </p>
          <p className="mt-3 text-xs text-slate-600">
            Prefer email?{" "}
            <a
              href="mailto:hello@sheconnects.work"
              className="font-medium text-violet-700 underline underline-offset-2"
            >
              hello@sheconnects.work
            </a>
          </p>
        </div>
        <form
          className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-4 shadow-md shadow-violet-100/70"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="mb-2 w-full rounded-md border border-violet-100 bg-white/80 p-2 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="Full name"
          />
          <input
            className="mb-2 w-full rounded-md border border-violet-100 bg-white/80 p-2 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="Organization"
          />
          <input
            type="email"
            className="mb-2 w-full rounded-md border border-violet-100 bg-white/80 p-2 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="you@org.org"
          />
          <textarea
            className="mb-2 w-full rounded-md border border-violet-100 bg-white/80 p-2 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            rows={3}
            placeholder="Short description"
          />
          <button
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            Submit (demo)
          </button>
        </form>
      </motion.div>
    </section>
  );
}
