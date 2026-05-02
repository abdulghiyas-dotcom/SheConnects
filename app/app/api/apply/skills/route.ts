import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const track = searchParams.get("track")

  if (!track) return NextResponse.json({ error: "track is required" }, { status: 400 })

  const skills = await prismaAdmin.skill.findMany({
    where: { track: track as never },
    select: { id: true, name: true, slug: true, category: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return NextResponse.json({ skills })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { skillIds } = body as { skillIds: string[] }

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return NextResponse.json({ error: "Select at least one skill" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    const freelancerId = dbUser.freelancer.id

    // Remove old skills, add new ones
    await prismaAdmin.freelancerSkill.deleteMany({ where: { freelancerId } })
    await prismaAdmin.freelancerSkill.createMany({
      data: skillIds.map((skillId, i) => ({
        freelancerId,
        skillId,
        level: "INTERMEDIATE",
        isPrimary: i === 0,
      })),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/skills error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
