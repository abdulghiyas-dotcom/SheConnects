"use client";

import { motion } from "framer-motion";
import { Search, FileText, Zap, UserCheck, GraduationCap, Briefcase } from "lucide-react";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "How it works",
    title: "Two sides of the same mission",
    orgLabel: "For organisations",
    orgSteps: [
      { icon: Search, title: "Share your needs", desc: "Tell us about your project, timeline, and required skills." },
      { icon: FileText, title: "We design your package", desc: "Our team matches you with the right freelancers and structures delivery." },
      { icon: Zap, title: "Delivery through SheConnects", desc: "We manage the full workflow — you receive finished work, on time." },
    ],
    womenLabel: "For Afghan women",
    womenSteps: [
      { icon: UserCheck, title: "Apply online", desc: "Submit your application with your skills, experience, and track preference." },
      { icon: GraduationCap, title: "Training & onboarding", desc: "Complete our skill-building programme and get ready to work with clients." },
      { icon: Briefcase, title: "Work & earn with support", desc: "Receive projects through SheConnects and earn income with ongoing support." },
    ],
  },
  it: {
    sectionLabel: "Come funziona",
    title: "Due lati della stessa missione",
    orgLabel: "Per le organizzazioni",
    orgSteps: [
      { icon: Search, title: "Condividi le tue esigenze", desc: "Raccontaci il tuo progetto, le scadenze e le competenze richieste." },
      { icon: FileText, title: "Progettiamo il tuo pacchetto", desc: "Il nostro team ti abbina ai freelancer giusti e struttura la consegna." },
      { icon: Zap, title: "Consegna tramite SheConnects", desc: "Gestiamo l'intero flusso di lavoro — ricevi il lavoro finito, in tempo." },
    ],
    womenLabel: "Per le donne afghane",
    womenSteps: [
      { icon: UserCheck, title: "Candidati online", desc: "Invia la tua candidatura con competenze, esperienza e track preferito." },
      { icon: GraduationCap, title: "Formazione e onboarding", desc: "Completa il nostro programma e preparati a lavorare con i clienti." },
      { icon: Briefcase, title: "Lavora e guadagna con supporto", desc: "Ricevi progetti tramite SheConnects e guadagna con supporto continuo." },
    ],
  },
};

type Props = { language: Language };

export default function HowItWorksNew({ language }: Props) {
  const c = content[language];

  return (
    <section
      id="how-it-works"
      className="py-28"
      style={{
        background: "linear-gradient(180deg, #080810 0%, #0a0a18 50%, #080810 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-400">
            {c.sectionLabel}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {c.title}
          </h2>
        </motion.div>

        {/* Two columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* For organisations */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-white/8 p-8"
            style={{ background: "#0F0F1A" }}
          >
            <div className="mb-7 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                {c.orgLabel}
              </p>
            </div>
            <div className="space-y-7">
              {c.orgSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                      <Icon size={17} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300">
                          {i + 1}
                        </span>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-white/45">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* For Afghan women */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-white/8 p-8"
            style={{ background: "#0F0F1A" }}
          >
            <div className="mb-7 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {c.womenLabel}
              </p>
            </div>
            <div className="space-y-7">
              {c.womenSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                      <Icon size={17} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300">
                          {i + 1}
                        </span>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-white/45">{step.desc}</p>
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
