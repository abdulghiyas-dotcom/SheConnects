import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ReviewClient } from "./review-client"

export default async function ReviewPage() {
  const user = await requireRole("FREELANCER")

  const [identity, freelancer] = await Promise.all([
    prismaAdmin.userIdentity.findUnique({
      where: { userId: user.id },
      select: {
        legalFirstName: true,
        legalLastName: true,
        countryOfResidence: true,
        cityOfResidence: true,
      },
    }),
    prismaAdmin.freelancer.findUnique({
      where: { userId: user.id },
      select: {
        track: true,
        tagline: true,
        bio: true,
        skills: {
          select: { skill: { select: { name: true } }, isPrimary: true },
          orderBy: { isPrimary: "desc" },
        },
        languages: { select: { language: true, proficiency: true } },
      },
    }),
  ])

  const TRACK_LABELS: Record<string, string> = {
    PROGRAMMING: "Development & Tech",
    CREATIVE_DESIGN: "Creative Design",
    TRANSLATION: "Translation & Language",
    RESEARCH_DATA: "Research & Data",
  }

  const PROFICIENCY_LABELS: Record<string, string> = {
    BASIC: "Basic",
    CONVERSATIONAL: "Conversational",
    FLUENT: "Fluent",
    NATIVE: "Native",
  }

  const sections = [
    {
      title: "Personal information",
      editPath: "/app/apply/about-you",
      rows: identity
        ? [
            { label: "Name", value: `${identity.legalFirstName} ${identity.legalLastName}` },
            { label: "Location", value: [identity.cityOfResidence, identity.countryOfResidence].filter(Boolean).join(", ") || "—" },
          ]
        : [{ label: "Status", value: "Not filled in" }],
    },
    {
      title: "Track",
      editPath: "/app/apply/track",
      rows: freelancer
        ? [{ label: "Selected track", value: TRACK_LABELS[freelancer.track] ?? freelancer.track }]
        : [{ label: "Status", value: "Not filled in" }],
    },
    {
      title: "Skills",
      editPath: "/app/apply/skills",
      rows: freelancer?.skills.length
        ? [{ label: "Selected skills", value: freelancer.skills.map((s) => s.skill.name).join(", ") }]
        : [{ label: "Status", value: "Not filled in" }],
    },
    {
      title: "About you",
      editPath: "/app/apply/experience",
      rows: freelancer
        ? [
            { label: "Headline", value: freelancer.tagline || "—" },
            { label: "Bio", value: freelancer.bio ? `${freelancer.bio.slice(0, 100)}…` : "—" },
            {
              label: "Languages",
              value: freelancer.languages.length
                ? freelancer.languages.map((l) => `${l.language} (${PROFICIENCY_LABELS[l.proficiency] ?? l.proficiency})`).join(", ")
                : "—",
            },
          ]
        : [{ label: "Status", value: "Not filled in" }],
    },
  ]

  return <ReviewClient sections={sections} userId={user.id} />
}
