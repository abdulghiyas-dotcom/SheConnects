import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

const VALID_STATUSES = ["QUEUED", "PROCESSING", "SENT", "DELIVERED", "FAILED", "CANCELLED"]

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

    await prismaAdmin.payout.update({
      where: { id: params.id },
      data: {
        status: status as never,
        sentAt: status === "SENT" ? new Date() : undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("PATCH /api/admin/payouts/[id] error:", err)
    return NextResponse.json({ error: "Failed to update payout" }, { status: 500 })
  }
}
