import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, Star, Globe, CheckCircle2, ShieldCheck, ArrowRight, Briefcase } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { Button } from "@/components/ui/button"
import { BackLink } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { Tag } from "@/components/ui/badge"
import { InitialsAvatar } from "@/components/ui/initials-avatar"
import { PlatformLayout } from "@/components/features/platform-layout"
import { TrackBadge } from "@/components/features/track"

const PROFICIENCY_LABEL: Record<string, string> = {
  NATIVE:          "Native",
  FLUENT:          "Fluent",
  CONVERSATIONAL:  "Conversational",
  BASIC:           "Basic",
}

const SKILL_LEVEL_LABEL: Record<string, string> = {
  EXPERT:       "Expert",
  ADVANCED:     "Advanced",
  INTERMEDIATE: "Intermediate",
  BEGINNER:     "Beginner",
}

export default async function FreelancerProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const user = await requireAuth()
  if (user.role === "FREELANCER") redirect("/app/freelancer/dashboard")

  const freelancer = await prismaPublic.freelancer.findUnique({
    where: { aliasSlug: params.slug, status: "ACTIVE" },
    select: {
      alias: true,
      aliasSlug: true,
      track: true,
      tagline: true,
      bio: true,
      displayCity: true,
      displayCountry: true,
      showCity: true,
      showCountry: true,
      averageRating: true,
      ratingCount: true,
      completedProjectCount: true,
      acceptingOffers: true,
      skills: {
        select: {
          skill: { select: { name: true, category: true } },
          isPrimary: true,
          level: true,
        },
        orderBy: { isPrimary: "desc" },
      },
      languages: {
        select: { language: true, proficiency: true },
      },
      portfolioItems: {
        where: { isPublic: true },
        select: { title: true, description: true, displayOrder: true },
        orderBy: { displayOrder: "asc" },
        take: 6,
      },
    },
  })

  if (!freelancer) notFound()

  const location = [
    freelancer.showCity && freelancer.displayCity,
    freelancer.showCountry && freelancer.displayCountry,
  ].filter(Boolean).join(", ")

  // Group skills by category
  const skillsByCategory: Record<string, typeof freelancer.skills> = {}
  for (const s of freelancer.skills) {
    const cat = s.skill.category ?? "Other"
    if (!skillsByCategory[cat]) skillsByCategory[cat] = []
    skillsByCategory[cat].push(s)
  }

  return (
    <PlatformLayout variant="client">
      <BackLink href="/app/freelancers">All freelancers</BackLink>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — main content */}
        <div className="space-y-4 lg:col-span-2">
          {/* Hero card */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <InitialsAvatar name={freelancer.alias} size="lg" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{freelancer.alias}</h1>
                  <ShieldCheck size={18} className="flex-shrink-0 text-emerald-500" />
                </div>
                {freelancer.tagline && <p className="mt-1 text-sm text-slate-500">{freelancer.tagline}</p>}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <TrackBadge track={freelancer.track} />
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {location}
                </span>
              )}
              {(freelancer.averageRating ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">{freelancer.averageRating?.toFixed(1)}</span>
                  ({freelancer.ratingCount} review{freelancer.ratingCount !== 1 ? "s" : ""})
                </span>
              )}
              {freelancer.completedProjectCount > 0 && (
                <span className="flex items-center gap-1">
                  <Briefcase size={13} />
                  {freelancer.completedProjectCount} project{freelancer.completedProjectCount !== 1 ? "s" : ""} completed
                </span>
              )}
            </div>

            {freelancer.bio && (
              <p className="mt-6 whitespace-pre-line border-t border-slate-100 pt-6 text-sm leading-relaxed text-slate-700">
                {freelancer.bio}
              </p>
            )}
          </Card>

          {/* Skills */}
          {freelancer.skills.length > 0 && (
            <Card className="p-6 sm:p-8">
              <Eyebrow className="mb-4">Skills</Eyebrow>
              <div className="space-y-5">
                {Object.keys(skillsByCategory).map((category) => (
                  <div key={category}>
                    <p className="mb-2 text-sm font-bold text-slate-900">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[category].map((s) => (
                        <Tag key={s.skill.name}>
                          {s.skill.name}
                          {s.isPrimary && (
                            <span className="ml-1.5 text-slate-400">· {SKILL_LEVEL_LABEL[s.level]}</span>
                          )}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Portfolio */}
          {freelancer.portfolioItems.length > 0 && (
            <Card className="p-6 sm:p-8">
              <Eyebrow className="mb-4">Portfolio</Eyebrow>
              <div className="space-y-4">
                {freelancer.portfolioItems.map((item) => (
                  <div key={item.title} className="border-l-2 border-indigo-200 pl-4">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-4">
          <Card className="space-y-4 p-6">
            {freelancer.acceptingOffers ? (
              <>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 size={16} /> Available for new projects
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href={`/app/offers/new?freelancer=${freelancer.aliasSlug}`}>
                    Send an offer <ArrowRight size={14} />
                  </Link>
                </Button>
                <p className="text-center text-xs leading-relaxed text-slate-400">
                  You&apos;ll be able to discuss details before anything is confirmed.
                </p>
              </>
            ) : (
              <p className="py-2 text-center text-sm text-slate-400">
                Not accepting new projects at this time.
              </p>
            )}
          </Card>

          {freelancer.languages.length > 0 && (
            <Card className="p-6">
              <Eyebrow className="mb-3 flex items-center gap-1.5">
                <Globe size={12} /> Languages
              </Eyebrow>
              <ul className="space-y-2">
                {freelancer.languages.map((l) => (
                  <li key={l.language} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{l.language}</span>
                    <span className="text-xs text-slate-400">
                      {PROFICIENCY_LABEL[l.proficiency] ?? l.proficiency}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex gap-2.5 rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-xs leading-relaxed text-slate-500">
            <ShieldCheck size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
            <p>
              Freelancers use a pseudonym to protect their identity. SheConnects verifies all
              professionals before they appear on the platform.
            </p>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
