import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { action, withdrawnReason } = body as {
      action: "accept" | "withdraw"
      withdrawnReason?: string
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { client: { select: { id: true } } },
    })
    if (!dbUser?.client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

    const offer = await prismaAdmin.offer.findUnique({
      where: { id: params.id },
      include: {
        currentRound: true,
        freelancer: { select: { id: true, alias: true, track: true } },
      },
    })

    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    if (offer.clientId !== dbUser.client.id) {
      return NextResponse.json({ error: "Not your offer" }, { status: 403 })
    }

    if (action === "accept") {
      if (offer.status !== "COUNTERED") {
        return NextResponse.json({ error: "No counter-offer to accept" }, { status: 409 })
      }
      const round = offer.currentRound!
      const freelancer = offer.freelancer!
      const scope = round.proposedScope?.trim() || null
      const titleLine = scope?.split("\n")[0].slice(0, 80) ?? null

      await prismaAdmin.$transaction(async (tx) => {
        await tx.offer.update({
          where: { id: offer.id },
          data: {
            status: "ACCEPTED",
            acceptedFreelancerPriceCents: round.freelancerPriceCents,
            acceptedCommissionCents: round.commissionCents,
            acceptedVatCents: round.vatCents,
            acceptedTotalCents: round.totalCents,
            acceptedCurrency: round.currency,
            acceptedTimeline: round.proposedTimeline,
            acceptedAt: new Date(),
            vatRegime: round.vatRegime,
          },
        })
        const project = await tx.project.create({
          data: {
            offerId: offer.id,
            clientId: offer.clientId,
            freelancerId: freelancer.id,
            title: titleLine ?? `Project with ${freelancer.alias}`,
            description: scope ?? "No scope provided.",
            track: freelancer.track,
            freelancerPriceCents: round.freelancerPriceCents,
            commissionCents: round.commissionCents,
            vatCents: round.vatCents,
            totalCents: round.totalCents,
            currency: round.currency,
            vatRegime: round.vatRegime,
          },
        })
        await tx.milestone.create({
          data: {
            projectId: project.id,
            title: "Project Delivery",
            orderIndex: 0,
            payoutPercentage: 100,
            status: "PENDING",
          },
        })
      })
      return NextResponse.json({ ok: true, status: "ACCEPTED" })
    }

    if (action === "withdraw") {
      if (["ACCEPTED", "DECLINED", "WITHDRAWN"].includes(offer.status)) {
        return NextResponse.json({ error: "Offer is already closed" }, { status: 409 })
      }
      await prismaAdmin.offer.update({
        where: { id: offer.id },
        data: { status: "WITHDRAWN", withdrawnReason: withdrawnReason?.trim() || null },
      })
      return NextResponse.json({ ok: true, status: "WITHDRAWN" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/offers/[id]/close error:", err)
    return NextResponse.json({ error: "Failed to close offer" }, { status: 500 })
  }
}
