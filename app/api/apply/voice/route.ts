import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { fileId } = body as { fileId: string }

    if (!fileId) return NextResponse.json({ error: "fileId is required" }, { status: 400 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true, applicationData: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    const existing = (dbUser.freelancer.applicationData as Record<string, unknown>) ?? {}

    await prismaAdmin.freelancer.update({
      where: { id: dbUser.freelancer.id },
      data: {
        applicationData: { ...existing, voiceIntroFileId: fileId },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/voice error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
