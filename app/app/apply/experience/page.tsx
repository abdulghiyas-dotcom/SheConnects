import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ExperienceForm } from "./experience-form"

export default async function ExperiencePage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: {
      tagline: true,
      bio: true,
      languages: { select: { language: true, proficiency: true } },
    },
  })

  return (
    <ExperienceForm
      initialData={{
        tagline: freelancer?.tagline ?? null,
        bio: freelancer?.bio ?? null,
        languages: (freelancer?.languages ?? []).map((l) => ({
          language: l.language,
          proficiency: l.proficiency,
        })),
      }}
    />
  )
}
