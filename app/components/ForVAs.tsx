"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { ArrowRight } from "lucide-react";

type VaProps = {
  content: SiteContent["vas"];
};

export default function ForVAs({ content }: VaProps) {
  return (
    <section id="vas" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-700 mb-4">
            For Afghan women
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((s, i) => (
            <motion.div
              key={s}
              className="relative rounded-2xl border border-accent-100 bg-white p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                {i + 1}
              </div>
              <p className="text-sm font-semibold text-slate-800">{s}</p>
              {i < content.steps.length - 1 && (
                <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/app/apply"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-accent-600 hover:-translate-y-0.5"
          >
            Apply now
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
