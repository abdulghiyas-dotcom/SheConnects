import Link from "next/link"
import { redirect } from "next/navigation"
import { MapPin, Star } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { ClientNav } from "@/components/features/client-nav"
import { cn } from "@/lib/utils/cn"

const TRACKS = [
  { value: "",                label: "All tracks" },
  { value: "PROGRAMMING",     label: "Dev & Tech" },
  { value: "CREATIVE_DESIGN", label: "Creative Design" },
  { value: "TRANSLATION",     label: "Translation" },
  { value: "RESEARCH_DATA",   label: "Research & Data" },
] as const

const TRACK_BADGE: Record<string, string> = {
  PROGRAMMING:     "bg-brand-50 text-brand-700",
  CREATIVE_DESIGN: "bg-accent-50 text-accent-700",
  TRANSLATION:     "bg-trust-50 text-trust-700",
  RESEARCH_DATA:   "bg-secondary text-foreground",
}

const TRACK_LABEL: Record<string, string> = {
  PROGRAMMING:     "Dev & Tech",
  CREATIVE_DESIGN: "Creative Design",
  TRANSLATION:     "Translation",
  RESEARCH_DATA:   "Research & Data",
}

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
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="freelancers" />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Freelancers</h1>
          <p className="text-muted-foreground mt-1">
            {freelancers.length} verified professional{freelancers.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Track filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {TRACKS.map((t) => (
            <Link
              key={t.value}
              href={t.value ? `/app/freelancers?track=${t.value}` : "/app/freelancers"}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-colors",
                trackFilter === t.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {freelancers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No freelancers in this track yet</p>
            <p className="text-sm mt-1">Check back soon — we're growing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancers.map((f) => {
              const location = [
                f.showCity && f.displayCity,
                f.showCountry && f.displayCountry,
              ].filter(Boolean).join(", ")

              return (
                <Link
                  key={f.aliasSlug}
                  href={`/app/freelancers/${f.aliasSlug}`}
                  className="bg-white rounded-xl border border-border hover:border-brand-300 hover:shadow-sm transition-all p-5 flex flex-col gap-3"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-lg leading-tight">{f.alias}</p>
                      {f.tagline && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{f.tagline}</p>
                      )}
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", TRACK_BADGE[f.track])}>
                      {TRACK_LABEL[f.track] ?? f.track}
                    </span>
                  </div>

                  {/* Skills */}
                  {f.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {f.skills.map((s) => (
                        <span
                          key={s.skill.name}
                          className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-1">
                    <div className="flex items-center gap-3">
                      {f.languages.length > 0 && (
                        <span>{f.languages.map((l) => l.language).join(" · ")}</span>
                      )}
                      {location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} /> {location}
                        </span>
                      )}
                    </div>
                    {(f.averageRating ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
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
      </main>
    </div>
  )
}
