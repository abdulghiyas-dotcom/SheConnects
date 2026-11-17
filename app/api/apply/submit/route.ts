import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    await prismaAdmin.freelancer.update({
      where: { id: dbUser.freelancer.id },
      data: {
        applicationData: { submittedAt: new Date().toISOString() },
        appliedAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/submit error:", err)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
