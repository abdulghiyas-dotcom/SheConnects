"use client";

import { motion } from "framer-motion";

type Language = "en" | "it";

const content = {
  en: {
    sectionLabel: "Our mission",
    quote: "Since 2021, hundreds of thousands of professional women in Afghanistan have lost the right to work. SheConnects creates dignified freelancing opportunities by connecting their skills to the international market.",
    storyTitle: "Built by people who reclaimed their rights",
    story: "SheConnects was founded in Milan by Afghan refugees who experienced firsthand the erasure of professional identity. We built this platform to prove that talent has no borders — and that the international market can be a force for good.",
    teamTitle: "The people behind SheConnects",
    team: [
      { name: "Abdul Kamyar", role: "CEO & Co-founder", initials: "AK", gradient: "from-indigo-500 to-purple-600" },
      { name: "Sediqa Sharifi", role: "CCO & Co-founder", initials: "SS", gradient: "from-purple-500 to-pink-600" },
    ],
    location: "Milan, Italy",
  },
  it: {
    sectionLabel: "La nostra missione",
    quote: "Dal 2021, centinaia di migliaia di donne professioniste in Afghanistan hanno perso il diritto al lavoro. SheConnects crea opportunità di lavoro freelance dignitoso connettendo le loro competenze al mercato internazionale.",
    storyTitle: "Costruito da persone che hanno rivendicato i propri diritti",
    story: "SheConnects è stata fondata a Milano da rifugiati afghani che hanno vissuto in prima persona la cancellazione dell'identità professionale. Abbiamo costruito questa piattaforma per dimostrare che il talento non ha confini.",
    teamTitle: "Le persone dietro SheConnects",
    team: [
      { name: "Abdul Kamyar", role: "CEO & Co-fondatore", initials: "AK", gradient: "from-indigo-500 to-purple-600" },
      { name: "Sediqa Sharifi", role: "CCO & Co-fondatrice", initials: "SS", gradient: "from-purple-500 to-pink-600" },
    ],
    location: "Milano, Italia",
  },
};

type Props = { language: Language };

export default function MissionSection({ language }: Props) {
  const c = content[language];

  return (
    <section
      id="organizations"
      className="py-28"
      style={{ background: "#080810" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mission quote */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-400">
            {c.sectionLabel}
          </span>
          <blockquote className="mx-auto max-w-3xl">
            <p className="text-2xl font-bold leading-relaxed text-white sm:text-3xl lg:text-4xl">
              <span className="text-white/30">"</span>
              {c.quote}
              <span className="text-white/30">"</span>
            </p>
          </blockquote>
        </motion.div>

        {/* Story + team */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-white/8 p-8"
            style={{ background: "#0F0F1A" }}
          >
            <h3 className="text-xl font-bold text-white mb-4">{c.storyTitle}</h3>
            <p className="text-base leading-relaxed text-white/50">{c.story}</p>

            {/* SDG badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <span className="text-xs font-semibold text-teal-400">SDG 5 — Gender Equality</span>
            </div>
          </motion.div>

          {/* Team */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-5 text-xs font-bold uppercase tracking-widest text-white/30"
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
                  className="rounded-2xl border border-white/8 p-6 text-center"
                  style={{ background: "#0F0F1A" }}
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} text-xl font-black text-white`}
                    style={{ boxShadow: "0 0 24px rgba(79,70,229,0.35)" }}
                  >
                    {member.initials}
                  </div>
                  <p className="text-base font-bold text-white">{member.name}</p>
                  <p className="text-xs text-white/40 mt-1">{member.role}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/8 px-3 py-1 text-[10px] text-white/30">
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
