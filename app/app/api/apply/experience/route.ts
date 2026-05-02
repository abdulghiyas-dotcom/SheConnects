import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

const VALID_PROFICIENCIES = ["BASIC", "CONVERSATIONAL", "FLUENT", "NATIVE"] as const

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { tagline, bio, languages } = body as {
      tagline: string
      bio: string
      languages: { language: string; proficiency: string }[]
    }

    if (!bio || bio.trim().length < 50) {
      return NextResponse.json({ error: "Bio must be at least 50 characters" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    const freelancerId = dbUser.freelancer.id

    await prismaAdmin.freelancer.update({
      where: { id: freelancerId },
      data: {
        tagline: tagline?.trim() || null,
        bio: bio.trim(),
      },
    })

    if (Array.isArray(languages) && languages.length > 0) {
      const validLanguages = languages.filter(
        (l) => l.language && VALID_PROFICIENCIES.includes(l.proficiency as never)
      )

      await prismaAdmin.freelancerLanguage.deleteMany({ where: { freelancerId } })
      if (validLanguages.length > 0) {
        await prismaAdmin.freelancerLanguage.createMany({
          data: validLanguages.map((l) => ({
            freelancerId,
            language: l.language,
            proficiency: l.proficiency as never,
          })),
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/experience error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
