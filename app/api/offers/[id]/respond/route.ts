import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { calculatePricing, getVatInfo } from "@/lib/utils/pricing"
import { emailOfferAcceptedClient, emailOfferAcceptedFreelancer, emailCounterReceived, emailOfferDeclined } from "@/lib/services/email"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { action, freelancerPriceCents, timeline, message, declinedReason } = body as {
      action: "accept" | "decline" | "counter"
      freelancerPriceCents?: number
      timeline?: string
      message?: string
      declinedReason?: string
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true, alias: true, track: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    const offer = await prismaAdmin.offer.findUnique({
      where: { id: params.id },
      include: {
        currentRound: true,
        rounds: { orderBy: { roundNumber: "desc" }, take: 1 },
        client: { select: { billingCountry: true, organizationName: true, user: { select: { email: true } } } },
      },
    })

    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    if (offer.freelancerId !== dbUser.freelancer.id) {
      return NextResponse.json({ error: "Not your offer" }, { status: 403 })
    }
    if (!["SENT", "CLIENT_REVIEWING"].includes(offer.status)) {
      return NextResponse.json({ error: "Offer is no longer open" }, { status: 409 })
    }

    if (action === "accept") {
      const round = offer.currentRound!
      const scope = round.proposedScope?.trim() || null
      const titleLine = scope?.split("\n")[0].slice(0, 80) ?? null
      const freelancer = dbUser.freelancer!

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
        await tx.payment.create({
          data: {
            projectId: project.id,
            clientId: offer.clientId,
            freelancerPriceCents: round.freelancerPriceCents,
            commissionCents: round.commissionCents,
            vatCents: round.vatCents,
            totalCents: round.totalCents,
            currency: round.currency,
            vatRegime: round.vatRegime,
            vatRate: round.vatRate,
            status: "PENDING",
          },
        })
      })

      const project = await prismaAdmin.project.findUnique({ where: { offerId: offer.id }, select: { id: true, title: true } })
      if (project) {
        emailOfferAcceptedClient(offer.client.user.email, offer.client.organizationName ?? "", project.title, project.id)
        emailOfferAcceptedFreelancer(dbUser.email!, freelancer.alias ?? "there", project.title, project.id)
      }

      return NextResponse.json({ ok: true, status: "ACCEPTED" })
    }

    if (action === "decline") {
      await prismaAdmin.offer.update({
        where: { id: offer.id },
        data: { status: "DECLINED", declinedReason: declinedReason?.trim() || null },
      })
      emailOfferDeclined(offer.client.user.email, offer.client.organizationName ?? "", dbUser.freelancer!.alias ?? "The freelancer")
      return NextResponse.json({ ok: true, status: "DECLINED" })
    }

    if (action === "counter") {
      if (!freelancerPriceCents || freelancerPriceCents < 100) {
        return NextResponse.json({ error: "Counter price must be at least €1" }, { status: 400 })
      }
      if (!timeline?.trim()) {
        return NextResponse.json({ error: "Timeline is required" }, { status: 400 })
      }

      const { vatRate, vatRegime } = getVatInfo(offer.client.billingCountry ?? null)
      const pricing = calculatePricing(freelancerPriceCents, vatRate)
      const lastRoundNumber = offer.rounds[0]?.roundNumber ?? 0

      await prismaAdmin.$transaction(async (tx) => {
        const newRound = await tx.negotiationRound.create({
          data: {
            offerId: offer.id,
            roundNumber: lastRoundNumber + 1,
            proposedBy: "FREELANCER",
            proposedById: dbUser.id,
            proposedTimeline: timeline.trim(),
            message: message?.trim() || null,
            proposedScope: offer.currentRound?.proposedScope || null,
            ...pricing,
            currency: "EUR",
            vatRegime,
            vatRate,
          },
        })
        await tx.offer.update({
          where: { id: offer.id },
          data: { status: "COUNTERED", currentRoundId: newRound.id },
        })
      })

      emailCounterReceived(offer.client.user.email, offer.client.organizationName ?? "", dbUser.freelancer!.alias ?? "The freelancer", offer.id)
      return NextResponse.json({ ok: true, status: "COUNTERED" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/offers/[id]/respond error:", err)
    return NextResponse.json({ error: "Failed to respond to offer" }, { status: 500 })
  }
}
