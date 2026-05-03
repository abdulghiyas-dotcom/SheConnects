"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { ArrowRight, Users } from "lucide-react";

type FinalProps = {
  content: SiteContent["finalCta"];
  common: SiteContent["common"];
};

export default function FinalCta({ content, common }: FinalProps) {
  return (
    <section id="final-cta" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 pb-20">
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 text-center shadow-brand-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%)" }}
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex items-center justify-center">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
              Start today
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-brand-100">
            {content.description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              {common.requestSupport}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/app/apply"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
            >
              <Users size={16} />
              {common.joinFreelancer}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
