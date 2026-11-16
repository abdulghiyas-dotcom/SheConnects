import Link from "next/link"
import { redirect } from "next/navigation"
import { MapPin, Star, ShieldCheck, Search } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Tag, choiceChipClass } from "@/components/ui/badge"
import { InitialsAvatar } from "@/components/ui/initials-avatar"
import { TrackBadge } from "@/components/features/track"

const TRACKS = [
  { value: "",                label: "All tracks" },
  { value: "PROGRAMMING",     label: "Dev & Tech" },
  { value: "CREATIVE_DESIGN", label: "Creative Design" },
  { value: "TRANSLATION",     label: "Translation" },
  { value: "RESEARCH_DATA",   label: "Research & Data" },
] as const

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
    <PlatformLayout variant="client">
      <PageHeader
        title="Freelancers"
        description={`${freelancers.length} verified professional${freelancers.length !== 1 ? "s" : ""} available`}
      />

      {/* Track filter */}
      <div className="flex flex-wrap items-center gap-2">
        {TRACKS.map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/app/freelancers?track=${t.value}` : "/app/freelancers"}
            className={choiceChipClass(trackFilter === t.value)}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {freelancers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No freelancers in this track yet"
          description="We're growing — check back soon or browse all tracks."
          action={
            <Button asChild variant="outline">
              <Link href="/app/freelancers">View all tracks</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {freelancers.map((f) => {
            const location = [
              f.showCity && f.displayCity,
              f.showCountry && f.displayCountry,
            ].filter(Boolean).join(", ")

            return (
              <Link
                key={f.aliasSlug}
                href={`/app/freelancers/${f.aliasSlug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-card-hover"
              >
                <div className="flex items-start gap-3">
                  <InitialsAvatar name={f.alias ?? "?"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-base font-black leading-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                        {f.alias}
                      </p>
                      <ShieldCheck size={14} className="flex-shrink-0 text-emerald-500" />
                    </div>
                    {f.tagline && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{f.tagline}</p>}
                  </div>
                  <TrackBadge track={f.track} />
                </div>

                {f.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.skills.map((s) => (
                      <Tag key={s.skill.name}>{s.skill.name}</Tag>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <div className="flex min-w-0 items-center gap-3">
                    {f.languages.length > 0 && (
                      <span className="truncate">{f.languages.map((l) => l.language).join(" · ")}</span>
                    )}
                    {location && (
                      <span className="flex flex-shrink-0 items-center gap-1">
                        <MapPin size={11} /> {location}
                      </span>
                    )}
                  </div>
                  {(f.averageRating ?? 0) > 0 && (
                    <span className="flex flex-shrink-0 items-center gap-1 font-semibold text-amber-600">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {f.averageRating?.toFixed(1)}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PlatformLayout>
  )
}
