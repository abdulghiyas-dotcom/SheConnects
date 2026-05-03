import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Globe, CheckCircle2 } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { Button } from "@/components/ui/button"
import { PlatformLayout } from "@/components/features/platform-layout"
import { cn } from "@/lib/utils/cn"

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
    <PlatformLayout variant="client" title={freelancer.alias}>
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/app/freelancers"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft size={14} /> All freelancers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hero card */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{freelancer.alias}</h1>
                  {freelancer.tagline && (
                    <p className="text-slate-500 mt-1">{freelancer.tagline}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-sm text-slate-500 flex-wrap">
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium", TRACK_BADGE[freelancer.track])}>
                      {TRACK_LABEL[freelancer.track] ?? freelancer.track}
                    </span>
                    {location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {location}
                      </span>
                    )}
                    {(freelancer.averageRating ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {freelancer.averageRating?.toFixed(1)} ({freelancer.ratingCount} review{freelancer.ratingCount !== 1 ? "s" : ""})
                      </span>
                    )}
                    {freelancer.completedProjectCount > 0 && (
                      <span>{freelancer.completedProjectCount} project{freelancer.completedProjectCount !== 1 ? "s" : ""} completed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {freelancer.bio && (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {freelancer.bio}
                </p>
              )}
            </div>

            {/* Skills */}
            {freelancer.skills.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Skills</h2>
                <div className="space-y-4">
                  {Object.keys(skillsByCategory).map((category) => (
                    <div key={category}>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillsByCategory[category].map((s) => (
                          <span
                            key={s.skill.name}
                            className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {s.skill.name}
                            {s.isPrimary && (
                              <span className="ml-1.5 text-slate-400">· {SKILL_LEVEL_LABEL[s.level]}</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {freelancer.portfolioItems.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Portfolio</h2>
                <div className="space-y-4">
                  {freelancer.portfolioItems.map((item) => (
                    <div key={item.title} className="border-l-2 border-brand-200 pl-4">
                      <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-4">
            {/* CTA card */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5 space-y-4">
              {freelancer.acceptingOffers ? (
                <>
                  <div className="flex items-center gap-1.5 text-trust-600 text-sm font-medium">
                    <CheckCircle2 size={16} /> Available for new projects
                  </div>
                  <Button asChild className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-brand text-sm font-semibold">
                    <Link href={`/app/offers/new?freelancer=${freelancer.aliasSlug}`}>
                      Send an offer
                    </Link>
                  </Button>
                  <p className="text-xs text-slate-400 text-center">
                    You'll be able to discuss details before anything is confirmed.
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">
                  Not accepting new projects at this time.
                </p>
              )}
            </div>

            {/* Languages */}
            {freelancer.languages.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Globe size={13} /> Languages
                </h3>
                <ul className="space-y-1.5">
                  {freelancer.languages.map((l) => (
                    <li key={l.language} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{l.language}</span>
                      <span className="text-xs text-slate-400">
                        {PROFICIENCY_LABEL[l.proficiency] ?? l.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Privacy note */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-400">
              <p>
                Freelancers use a pseudonym to protect their identity. SheConnects verifies all
                professionals before they appear on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
