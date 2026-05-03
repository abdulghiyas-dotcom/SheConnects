"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, Star } from "lucide-react"
import { cn } from "@/lib/utils/cn"

type Track = "PROGRAMMING" | "CREATIVE_DESIGN" | "TRANSLATION" | "RESEARCH_DATA"

const trackConfig: Record<Track, { label: string; color: string; bg: string }> = {
  PROGRAMMING:     { label: "Programming",     color: "text-brand-700",  bg: "bg-brand-50 border-brand-100" },
  CREATIVE_DESIGN: { label: "Creative & Design", color: "text-violet-700", bg: "bg-violet-50 border-violet-100" },
  TRANSLATION:     { label: "Translation",     color: "text-amber-700",  bg: "bg-amber-50 border-amber-100" },
  RESEARCH_DATA:   { label: "Research & Data", color: "text-teal-700",   bg: "bg-teal-50 border-teal-100" },
}

const avatarAccents = [
  "from-brand-400 to-brand-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-teal-400 to-teal-600",
  "from-pink-400 to-pink-600",
]

type Props = {
  alias: string
  track?: Track
  skills: string[]
  completedProjects?: number
  rating?: number
  profileHref: string
  offerHref?: string
  index?: number
  viewProfileLabel?: string
  sendOfferLabel?: string
  verifiedLabel?: string
}

export function FreelancerCard({
  alias,
  track,
  skills,
  completedProjects = 0,
  rating,
  profileHref,
  offerHref,
  index = 0,
  viewProfileLabel = "View profile",
  sendOfferLabel = "Send offer",
  verifiedLabel = "Verified alias",
}: Props) {
  const accent = avatarAccents[index % avatarAccents.length]
  const trackInfo = track ? trackConfig[track] : null
  const initials = alias.slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white font-bold text-lg shadow-sm", accent)}>
          {initials}
        </div>

        {trackInfo && (
          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", trackInfo.bg, trackInfo.color)}>
            {trackInfo.label}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-slate-900">{alias}</h3>
          <ShieldCheck size={14} className="text-trust-500 flex-shrink-0" />
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{verifiedLabel}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400">
            +{skills.length - 3}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
        {completedProjects > 0 && (
          <span>{completedProjects} project{completedProjects !== 1 ? "s" : ""}</span>
        )}
        {rating !== undefined && rating > 0 && (
          <span className="flex items-center gap-1">
            <Star size={11} className="fill-accent-400 text-accent-400" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
        <Link
          href={profileHref}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {viewProfileLabel}
        </Link>
        {offerHref && (
          <Link
            href={offerHref}
            className="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-brand-700 shadow-brand"
          >
            {sendOfferLabel}
          </Link>
        )}
      </div>
    </motion.div>
  )
}
