import Link from "next/link"
import { redirect } from "next/navigation"
import { MapPin, Star, ShieldCheck, Search } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { PlatformLayout } from "@/components/features/platform-layout"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

const TRACKS = [
  { value: "",                label: "All tracks" },
  { value: "PROGRAMMING",     label: "Dev & Tech" },
  { value: "CREATIVE_DESIGN", label: "Creative Design" },
  { value: "TRANSLATION",     label: "Translation" },
  { value: "RESEARCH_DATA",   label: "Research & Data" },
] as const

const TRACK_STYLES: Record<string, { badge: string; dot: string }> = {
  PROGRAMMING:     { badge: "bg-brand-50 text-brand-700 border-brand-100",   dot: "bg-brand-500" },
  CREATIVE_DESIGN: { badge: "bg-accent-50 text-accent-700 border-accent-100", dot: "bg-accent-500" },
  TRANSLATION:     { badge: "bg-trust-50 text-trust-700 border-trust-100",   dot: "bg-trust-500" },
  RESEARCH_DATA:   { badge: "bg-violet-50 text-violet-700 border-violet-100", dot: "bg-violet-500" },
}

const TRACK_LABEL: Record<string, string> = {
  PROGRAMMING:     "Dev & Tech",
  CREATIVE_DESIGN: "Creative Design",
  TRANSLATION:     "Translation",
  RESEARCH_DATA:   "Research & Data",
}

const AVATAR_GRADIENTS = [
  "from-brand-400 to-brand-600",
  "from-accent-400 to-accent-600",
  "from-trust-400 to-trust-600",
  "from-violet-400 to-violet-600",
  "from-teal-400 to-teal-600",
]

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: { track?: string }
}) {
  const user = await requireAuth()
  if (user.role === "FREELANCER") redirect("/app/freelancer/dashboard")

  const trackFilter = searchParams.track ?? ""

  const freelancers = await prismaPublic.freelancer.findMany({
    where: {
      status: "ACTIVE",
      acceptingOffers: true,
      ...(trackFilter ? { track: trackFilter as never } : {}),
    },
    select: {
      alias: true,
      aliasSlug: true,
      track: true,
      tagline: true,
      displayCity: true,
      displayCountry: true,
      showCity: true,
      showCountry: true,
      averageRating: true,
      completedProjectCount: true,
      skills: {
        select: { skill: { select: { name: true } }, isPrimary: true },
        orderBy: { isPrimary: "desc" },
        take: 4,
      },
      languages: {
        select: { language: true, proficiency: true },
        take: 3,
      },
    },
    orderBy: [{ averageRating: "desc" }, { completedProjectCount: "desc" }],
  })

  return (
    <PlatformLayout variant="client" title="Freelancers">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Freelancers</h1>
            <p className="mt-1 text-sm text-slate-500">
              {freelancers.length} verified professional{freelancers.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* Track filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {TRACKS.map((t) => (
            <Link
              key={t.value}
              href={t.value ? `/app/freelancers?track=${t.value}` : "/app/freelancers"}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                trackFilter === t.value
                  ? "bg-brand-600 text-white border-brand-600 shadow-brand"
                  : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {freelancers.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState
              icon={Search}
              title="No freelancers in this track yet"
              description="We're growing — check back soon or browse all tracks."
              action={
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/app/freelancers">View all tracks</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancers.map((f, idx) => {
              const location = [
                f.showCity && f.displayCity,
                f.showCountry && f.displayCountry,
              ].filter(Boolean).join(", ")
              const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
              const trackStyle = TRACK_STYLES[f.track] ?? { badge: "bg-slate-50 text-slate-600 border-slate-200", dot: "bg-slate-400" }
              const initials = (f.alias ?? "?").slice(0, 2).toUpperCase()

              return (
                <Link
                  key={f.aliasSlug}
                  href={`/app/freelancers/${f.aliasSlug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-bold text-white shadow-sm`}>
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 leading-tight">{f.alias}</p>
                        <ShieldCheck size={14} className="text-trust-500 flex-shrink-0" />
                      </div>
                      {f.tagline && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{f.tagline}</p>
                      )}
                    </div>

                    {/* Track badge */}
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium flex-shrink-0",
                      trackStyle.badge
                    )}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", trackStyle.dot)} />
                      {TRACK_LABEL[f.track] ?? f.track}
                    </span>
                  </div>

                  {/* Skills */}
                  {f.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {f.skills.map((s) => (
                        <span
                          key={s.skill.name}
                          className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      {f.languages.length > 0 && (
                        <span>{f.languages.map((l) => l.language).join(" · ")}</span>
                      )}
                      {location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} className="flex-shrink-0" /> {location}
                        </span>
                      )}
                    </div>
                    {(f.averageRating ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {f.averageRating?.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
