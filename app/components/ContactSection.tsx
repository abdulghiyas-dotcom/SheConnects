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
            looking for. We&apos;ll get back to you with next steps.
          </p>
          <p className="mt-3 text-xs text-slate-500">
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
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          action="https://formsubmit.co/hello@sheconnects.work"
          method="POST"
        >
          {/* Formsubmit settings */}
          <input
            type="hidden"
            name="_subject"
            value="New contact from SheConnects website"
          />
          <input type="hidden" name="_captcha" value="false" />

          <div className="mb-2">
            <input
              name="name"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder="Full name"
              required
            />
          </div>

          <div className="mb-2">
            <input
              name="organization"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder="Organization"
            />
          </div>

          <div className="mb-2">
            <input
              type="email"
              name="email"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder="you@org.org"
              required
            />
          </div>

          <div className="mb-2">
            <textarea
              name="message"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              rows={3}
              placeholder="Short description of your needs"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 hover:opacity-95"
          >
            Send message
          </button>

          <p className="mt-2 text-[11px] text-slate-400">
            By submitting, you agree that we may process your data in line with
            our{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-violet-700"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </motion.div>
    </section>
  );
}
