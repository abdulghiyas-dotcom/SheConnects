import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { SkillsForm } from "./skills-form"

export default async function SkillsPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: {
      track: true,
      skills: { select: { skillId: true } },
    },
  })

  const track = freelancer?.track ?? "TRANSLATION"

  const skills = await prismaAdmin.skill.findMany({
    where: { track },
    select: { id: true, name: true, category: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  const selectedIds = (freelancer?.skills ?? []).map((s) => s.skillId)

  return <SkillsForm skills={skills} selectedIds={selectedIds} />
}
