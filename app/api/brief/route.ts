import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

const VALID_TRACKS = ["PROGRAMMING", "CREATIVE_DESIGN", "TRANSLATION", "RESEARCH_DATA"]

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { client: { select: { id: true } } },
    })
    if (!dbUser?.client) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json() as {
      title?: string
      description?: string
      suggestedTrack?: string
      estimatedHours?: number
      aiSummary?: string
      trackConfidence?: number
    }

    const title = body.title?.trim()
    const description = body.description?.trim()
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }
    if (title.length > 200) return NextResponse.json({ error: "Title too long" }, { status: 400 })
    if (description.length > 8000) return NextResponse.json({ error: "Description too long" }, { status: 400 })

    const suggestedTrack = body.suggestedTrack && VALID_TRACKS.includes(body.suggestedTrack)
      ? body.suggestedTrack
      : undefined

    const brief = await prismaAdmin.brief.create({
      data: {
        clientId: dbUser.client.id,
        title,
        description,
        suggestedTrack: suggestedTrack as never ?? null,
        trackConfidence: typeof body.trackConfidence === "number" ? body.trackConfidence : null,
        estimatedHours: typeof body.estimatedHours === "number" ? body.estimatedHours : null,
        aiSummary: body.aiSummary?.slice(0, 300) ?? null,
        builtByAi: !!body.aiSummary,
      },
    })

    return NextResponse.json({ id: brief.id })
  } catch (err) {
    console.error("POST /api/brief error:", err)
    return NextResponse.json({ error: "Failed to save brief" }, { status: 500 })
  }
}
