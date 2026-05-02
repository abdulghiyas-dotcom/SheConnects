import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Globe, CheckCircle2 } from "lucide-react"
import { requireAuth } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { Button } from "@/components/ui/button"
import { ClientNav } from "@/components/features/client-nav"
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
  const skillsByCategory = freelancer.skills.reduce((acc, s) => {
    const cat = s.skill.category ?? "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {} as Record<string, typeof freelancer.skills>)

  return (
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="freelancers" />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <Link
          href="/app/freelancers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={14} /> All freelancers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero card */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-semibold">{freelancer.alias}</h1>
                  {freelancer.tagline && (
                    <p className="text-muted-foreground mt-1">{freelancer.tagline}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
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
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {freelancer.bio}
                </p>
              )}
            </div>

            {/* Skills */}
            {freelancer.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-semibold mb-4">Skills</h2>
                <div className="space-y-4">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category}>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <span
                            key={s.skill.name}
                            className="text-sm px-3 py-1 rounded-full bg-secondary text-foreground"
                          >
                            {s.skill.name}
                            {s.isPrimary && (
                              <span className="ml-1.5 text-xs text-muted-foreground">· {SKILL_LEVEL_LABEL[s.level]}</span>
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
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-semibold mb-4">Portfolio</h2>
                <div className="space-y-4">
                  {freelancer.portfolioItems.map((item) => (
                    <div key={item.title} className="border-l-2 border-brand-200 pl-4">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-4">
            {/* CTA card */}
            <div className="bg-white rounded-xl border border-border p-5 space-y-4">
              {freelancer.acceptingOffers ? (
                <>
                  <div className="flex items-center gap-1.5 text-trust-600 text-sm font-medium">
                    <CheckCircle2 size={16} /> Available for new projects
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/app/offers/new?freelancer=${freelancer.aliasSlug}`}>
                      Send an offer
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You'll be able to discuss details before anything is confirmed.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Not accepting new projects at this time.
                </p>
              )}
            </div>

            {/* Languages */}
            {freelancer.languages.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-1.5">
                  <Globe size={14} /> Languages
                </h3>
                <ul className="space-y-1.5">
                  {freelancer.languages.map((l) => (
                    <li key={l.language} className="flex items-center justify-between text-sm">
                      <span>{l.language}</span>
                      <span className="text-xs text-muted-foreground">
                        {PROFICIENCY_LABEL[l.proficiency] ?? l.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Privacy note */}
            <div className="rounded-xl bg-secondary/60 border border-border p-4 text-xs text-muted-foreground">
              <p>
                Freelancers use a pseudonym to protect their identity. SheConnects verifies all
                professionals before they appear on the platform.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
