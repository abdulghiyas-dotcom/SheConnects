"use client";

import { motion } from "framer-motion";
import { Search, FileText, Zap, UserCheck, GraduationCap, Briefcase } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "How it works",
    title: "Two sides of one mission",
    orgLabel: "For organisations",
    orgColor: "indigo",
    orgSteps: [
      { icon: Search,   title: "Share your needs",          desc: "Tell us your project, timeline, and required skills. One conversation is enough." },
      { icon: FileText, title: "We design your package",    desc: "We match you with the right specialists and structure delivery end to end." },
      { icon: Zap,      title: "Receive finished work",     desc: "Managed workflow, clear milestones, and finished deliverables — on time." },
    ],
    womenLabel: "For Afghan women",
    womenColor: "amber",
    womenSteps: [
      { icon: UserCheck,      title: "Apply online",         desc: "Submit your skills, experience, and preferred studio track. It's free." },
      { icon: GraduationCap, title: "Train and onboard",    desc: "Complete our skill programme and get matched with your first client." },
      { icon: Briefcase,     title: "Work and earn",        desc: "Receive projects, earn real income, and grow your portfolio — with ongoing support." },
    ],
  },
  it: {
    sectionLabel: "Come funziona",
    title: "Due lati di un'unica missione",
    orgLabel: "Per le organizzazioni",
    orgColor: "indigo",
    orgSteps: [
      { icon: Search,   title: "Condividi le tue esigenze", desc: "Raccontaci il tuo progetto. Una conversazione è sufficiente." },
      { icon: FileText, title: "Progettiamo il pacchetto",  desc: "Ti abbiniamo con le professioniste giuste e strutturiamo la consegna." },
      { icon: Zap,      title: "Ricevi il lavoro finito",   desc: "Workflow gestito, milestone chiare, deliverable completati — nei tempi." },
    ],
    womenLabel: "Per le donne afghane",
    womenColor: "amber",
    womenSteps: [
      { icon: UserCheck,      title: "Candidati online",         desc: "Invia competenze ed esperienza. È gratuito." },
      { icon: GraduationCap, title: "Formazione e onboarding",  desc: "Completa il programma e ricevi il tuo primo progetto." },
      { icon: Briefcase,     title: "Lavora e guadagna",        desc: "Ricevi progetti, guadagna, fai crescere il tuo portfolio — con supporto." },
    ],
  },
};

const palette = {
  indigo: {
    section: "#F5F3FF",
    badge: "text-indigo-600 bg-indigo-100",
    dot:   "bg-indigo-600",
    icon:  "bg-indigo-100 text-indigo-600",
    num:   "bg-indigo-600 text-white",
    line:  "bg-indigo-100",
  },
  amber: {
    section: "#FFFBEB",
    badge: "text-amber-700 bg-amber-100",
    dot:   "bg-amber-500",
    icon:  "bg-amber-100 text-amber-600",
    num:   "bg-amber-500 text-white",
    line:  "bg-amber-100",
  },
};

type Col = { label: string; color: "indigo" | "amber"; steps: { icon: React.ComponentType<{ size: number; className: string }>; title: string; desc: string }[] };

function StepColumn({ col, delay }: { col: Col; delay: number }) {
  const pal = palette[col.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
    >
      <div className={`mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${pal.badge}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${pal.dot}`} />
        {col.label}
      </div>

      <div className="relative space-y-0">
        {col.steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === col.steps.length - 1;
          return (
            <div key={step.title} className="flex gap-4">
              {/* Left: number + connector */}
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${pal.num}`}>
                  {i + 1}
                </div>
                {!isLast && <div className={`mt-1 mb-1 w-px flex-1 ${pal.line}`} style={{ minHeight: "32px" }} />}
              </div>
              {/* Right: content */}
              <div className={`${isLast ? "pb-0" : "pb-8"} pt-1`}>
                <div className={`mb-1 inline-flex items-center justify-center rounded-xl p-1.5 ${pal.icon}`}>
                  <Icon size={15} className={pal.icon.split(" ")[1]} />
                </div>
                <p className="text-sm font-bold text-slate-900 mt-2">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

type Props = { language: Language };

export default function HowItWorksNew({ language }: Props) {
  const c = content[language];

  return (
    <section id="how-it-works" className="relative overflow-hidden py-28 bg-white">
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 rounded-full"
        style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.18, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 rounded-full"
        style={{ width: 360, height: 360, background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.14, 1], x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 280, height: 280, background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {c.title}
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <StepColumn
            col={{ label: c.orgLabel, color: "indigo", steps: c.orgSteps as Col["steps"] }}
            delay={0}
          />
          <StepColumn
            col={{ label: c.womenLabel, color: "amber", steps: c.womenSteps as Col["steps"] }}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
