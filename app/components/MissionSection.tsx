"use client";

import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Our mission",
    quote: "Since 2021, hundreds of thousands of professional women in Afghanistan have lost the right to work.",
    quoteEnd: "SheConnects creates dignified freelancing opportunities by connecting their skills to the international market.",
    storyTitle: "Built by people who reclaimed their rights",
    story: "SheConnects was founded in Milan by Afghan refugees who experienced firsthand the erasure of professional identity. We built this platform to prove that talent has no borders — and that the global market can be a force for good.",
    sdg: "SDG 5 — Gender Equality",
    teamTitle: "The people behind SheConnects",
    location: "Milan, Italy",
    team: [
      { name: "Abdul Kamyar",   role: "CEO & Co-founder",  initials: "AK", from: "from-indigo-500 to-purple-600" },
      { name: "Sediqa Sharifi", role: "CCO & Co-founder",  initials: "SS", from: "from-amber-400  to-orange-500"  },
    ],
  },
  it: {
    sectionLabel: "La nostra missione",
    quote: "Dal 2021, centinaia di migliaia di donne professioniste in Afghanistan hanno perso il diritto al lavoro.",
    quoteEnd: "SheConnects crea opportunità di lavoro freelance dignitoso connettendo le loro competenze al mercato internazionale.",
    storyTitle: "Costruito da persone che hanno rivendicato i propri diritti",
    story: "SheConnects è stata fondata a Milano da rifugiati afghani che hanno vissuto in prima persona la cancellazione dell'identità professionale. Abbiamo costruito questa piattaforma per dimostrare che il talento non ha confini.",
    sdg: "SDG 5 — Uguaglianza di genere",
    teamTitle: "Le persone dietro SheConnects",
    location: "Milano, Italia",
    team: [
      { name: "Abdul Kamyar",   role: "CEO & Co-fondatore",  initials: "AK", from: "from-indigo-500 to-purple-600" },
      { name: "Sediqa Sharifi", role: "CCO & Co-fondatrice", initials: "SS", from: "from-amber-400  to-orange-500"  },
    ],
  },
};

type Props = { language: Language };

export default function MissionSection({ language }: Props) {
  const c = content[language];

  return (
    <section id="organizations" className="relative overflow-hidden bg-white py-28">
      {/* Animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-20 right-0 rounded-full"
        style={{ width: 480, height: 480, background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.13, 1], x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 -left-20 rounded-full"
        style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.18, 1], x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Large pull-quote */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {c.sectionLabel}
          </span>
          {/* Decorative quotation mark */}
          <div className="mb-4 text-7xl font-black leading-none text-indigo-100 select-none">"</div>
          <blockquote className="mx-auto max-w-3xl">
            <p className="text-2xl font-black leading-relaxed tracking-tight text-slate-900 sm:text-3xl">
              {c.quote}
            </p>
            <p className="mt-4 text-xl font-semibold leading-relaxed text-indigo-600 sm:text-2xl">
              {c.quoteEnd}
            </p>
          </blockquote>
        </motion.div>

        {/* Story + Team grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

          {/* Story card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-8"
          >
            <h3 className="text-xl font-black text-slate-900 mb-4">{c.storyTitle}</h3>
            <p className="text-base leading-relaxed text-slate-600">{c.story}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">{c.sdg}</span>
            </div>
          </motion.div>

          {/* Team */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-5 text-[11px] font-bold uppercase tracking-widest text-slate-400"
            >
              {c.teamTitle}
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${member.from} text-xl font-black text-white shadow-md`}>
                    {member.initials}
                  </div>
                  <p className="text-base font-black text-slate-900">{member.name}</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">{member.role}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] text-slate-500">
                    {c.location}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
