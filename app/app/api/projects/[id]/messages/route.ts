import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json() as { body: string }
    const text = body.body?.trim()
    if (!text) return NextResponse.json({ error: "Message is required" }, { status: 400 })
    if (text.length > 4000) return NextResponse.json({ error: "Message too long" }, { status: 400 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: {
        freelancer: { select: { id: true } },
        client: { select: { id: true } },
      },
    })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const project = await prismaAdmin.project.findUnique({
      where: { id: params.id },
      select: { id: true, clientId: true, freelancerId: true },
    })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    const isMember =
      dbUser.client?.id === project.clientId ||
      dbUser.freelancer?.id === project.freelancerId
    if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prismaAdmin.message.create({
      data: {
        projectId: project.id,
        authorId: dbUser.id,
        bodyOriginal: text,
        originalLanguage: "en",
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("POST /api/projects/[id]/messages error:", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
