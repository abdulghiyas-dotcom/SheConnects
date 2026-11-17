import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

const VALID_TRACKS = ["PROGRAMMING", "CREATIVE_DESIGN", "TRANSLATION", "RESEARCH_DATA"] as const

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { track } = body

    if (!VALID_TRACKS.includes(track)) {
      return NextResponse.json({ error: "Invalid track" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    await prismaAdmin.freelancer.update({
      where: { userId: dbUser.id },
      data: { track },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/track error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
