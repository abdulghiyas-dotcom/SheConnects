"use client";

import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { Search, FileText, Zap, BarChart3, UserCheck, GraduationCap, Briefcase, DollarSign } from "lucide-react";

type HowProps = {
  content: SiteContent["howItWorks"];
};

const clientIcons = [Search, FileText, Zap, BarChart3];
const freelancerIcons = [UserCheck, GraduationCap, Briefcase, DollarSign];

export default function HowItWorks({ content }: HowProps) {
  const allSteps = content.steps;
  const mid = Math.ceil(allSteps.length / 2);
  const clientSteps = allSteps.slice(0, mid);
  const freelancerSteps = allSteps.slice(mid);

  return (
    <section
      id="how-it-works"
      className="bg-slate-900 py-20"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #0f172a 10%, #0f172a 90%, #f8fafc 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
            How it works
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* For clients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
          >
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-brand-300">
              For organisations
            </p>
            <div className="space-y-5">
              {clientSteps.map((step, i) => {
                const Icon = clientIcons[i] ?? Search;
                return (
                  <motion.div
                    key={step}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/20">
                      <Icon size={18} className="text-brand-300" />
                    </div>
                    <div className="flex items-start gap-3 pt-1">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-200">{step}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* For freelancers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
          >
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent-300">
              For Afghan women
            </p>
            <div className="space-y-5">
              {freelancerSteps.map((step, i) => {
                const Icon = freelancerIcons[i] ?? UserCheck;
                return (
                  <motion.div
                    key={step}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500/20 border border-accent-400/20">
                      <Icon size={18} className="text-accent-300" />
                    </div>
                    <div className="flex items-start gap-3 pt-1">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-200">{step}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
