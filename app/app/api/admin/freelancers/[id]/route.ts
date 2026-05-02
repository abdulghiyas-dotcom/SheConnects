import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { emailApplicationStatusChanged } from "@/lib/services/email"

const VALID_STATUSES = ["SCREENING", "INTERVIEW", "TRAINING", "ACTIVE", "ON_BREAK", "REJECTED", "REMOVED"]

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
    if (!dbUser || !["ADMIN", "TEAM"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { status } = await req.json() as { status: string }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const now = new Date()
    const timestamps: Record<string, Date | null> = {}
    if (status === "SCREENING")  timestamps.screenedAt = now
    if (status === "ACTIVE")     timestamps.acceptedAt = now

    const freelancer = await prismaAdmin.freelancer.update({
      where: { id: params.id },
      data: {
        status: status as never,
        acceptingOffers: status === "ACTIVE",
        ...timestamps,
      },
      include: { user: { select: { email: true } } },
    })

    emailApplicationStatusChanged(freelancer.user.email, status)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("PATCH /api/admin/freelancers/[id] error:", err)
    return NextResponse.json({ error: "Failed to update freelancer" }, { status: 500 })
  }
}
