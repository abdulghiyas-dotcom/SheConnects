import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { calculatePricing, getVatInfo } from "@/lib/utils/pricing"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { freelancerSlug, scope, freelancerPriceCents, timeline, message } = body as {
      freelancerSlug: string
      scope: string
      freelancerPriceCents: number
      timeline: string
      message?: string
    }

    if (!scope?.trim()) return NextResponse.json({ error: "Project scope is required" }, { status: 400 })
    if (!freelancerPriceCents || freelancerPriceCents < 100) {
      return NextResponse.json({ error: "Minimum offer is €1" }, { status: 400 })
    }
    if (!timeline?.trim()) return NextResponse.json({ error: "Timeline is required" }, { status: 400 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { client: { select: { id: true, billingCountry: true } } },
    })
    if (!dbUser?.client) return NextResponse.json({ error: "Client account not found" }, { status: 404 })

    const freelancer = await prismaAdmin.freelancer.findUnique({
      where: { aliasSlug: freelancerSlug, status: "ACTIVE" },
      select: { id: true, acceptingOffers: true },
    })
    if (!freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    if (!freelancer.acceptingOffers) {
      return NextResponse.json({ error: "This freelancer is not accepting new offers" }, { status: 409 })
    }

    const { vatRate, vatRegime } = getVatInfo(dbUser.client.billingCountry ?? null)
    const pricing = calculatePricing(freelancerPriceCents, vatRate)

    // Create Offer + first NegotiationRound in a transaction
    const offer = await prismaAdmin.$transaction(async (tx) => {
      const newOffer = await tx.offer.create({
        data: {
          clientId: dbUser.client!.id,
          freelancerId: freelancer.id,
          status: "SENT",
          originPath: "DIRECT_PICK",
          vatRegime,
        },
      })

      const round = await tx.negotiationRound.create({
        data: {
          offerId: newOffer.id,
          roundNumber: 1,
          proposedBy: "CLIENT",
          proposedById: dbUser.id,
          proposedScope: scope.trim(),
          proposedTimeline: timeline.trim(),
          message: message?.trim() || null,
          ...pricing,
          currency: "EUR",
          vatRegime,
          vatRate,
        },
      })

      return tx.offer.update({
        where: { id: newOffer.id },
        data: { currentRoundId: round.id },
      })
    })

    return NextResponse.json({ ok: true, offerId: offer.id })
  } catch (err) {
    console.error("POST /api/offers error:", err)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
