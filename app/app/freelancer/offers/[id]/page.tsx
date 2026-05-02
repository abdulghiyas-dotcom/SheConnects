import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { formatEur, getVatInfo } from "@/lib/utils/pricing"
import { RespondForm } from "./respond-form"
import { cn } from "@/lib/utils/cn"

export default async function FreelancerOfferDetailPage({ params }: { params: { id: string } }) {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const offer = await prismaAdmin.offer.findUnique({
    where: { id: params.id, freelancerId: freelancer!.id },
    include: {
      client: { select: { organizationName: true, billingCountry: true } },
      rounds: {
        orderBy: { roundNumber: "asc" },
        select: {
          roundNumber: true,
          proposedBy: true,
          proposedScope: true,
          proposedTimeline: true,
          message: true,
          freelancerPriceCents: true,
          commissionCents: true,
          vatCents: true,
          totalCents: true,
          createdAt: true,
        },
      },
      currentRound: { select: { freelancerPriceCents: true } },
    },
  })

  if (!offer) notFound()

  const { vatRate, vatRegime } = getVatInfo(offer.client.billingCountry ?? null)
  const vatLabel =
    vatRegime === "IT_DOMESTIC" ? "IVA (22%)"
    : vatRegime === "EU_B2B"   ? "VAT (0% — reverse charge)"
    : "VAT (0%)"

  const canRespond = offer.status === "SENT"

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-base font-semibold">SheConnects</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app/freelancer/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/app/freelancer/offers" className="text-foreground font-medium">Offers</Link>
            <Link href="/app/sign-in" className="text-muted-foreground hover:text-foreground">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Link href="/app/freelancer/offers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> All offers
        </Link>

        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-xl font-semibold">Offer from {offer.client.organizationName}</h1>
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium shrink-0",
              offer.status === "SENT" ? "bg-amber-50 text-amber-700" :
              offer.status === "ACCEPTED" ? "bg-trust-50 text-trust-700" :
              "bg-secondary text-muted-foreground"
            )}>
              {offer.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Received {new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Negotiation rounds */}
        <div className="space-y-3">
          {offer.rounds.map((round) => (
            <div key={round.roundNumber} className={cn(
              "bg-white rounded-xl border border-border p-5",
              round.proposedBy === "FREELANCER" ? "ml-4" : "ml-0"
            )}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {round.proposedBy === "CLIENT" ? offer.client.organizationName : "Your counter"} · Round {round.roundNumber}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(round.createdAt).toLocaleDateString("en-GB")}</p>
              </div>

              {round.proposedScope && (
                <p className="text-sm text-foreground mb-3 whitespace-pre-line">{round.proposedScope}</p>
              )}

              {round.message && (
                <p className="text-sm text-muted-foreground italic mb-3">"{round.message}"</p>
              )}

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                <span>Your earnings</span><span>{formatEur(round.freelancerPriceCents)}</span>
                <span>Platform fee</span><span>{formatEur(round.commissionCents)}</span>
                {round.vatCents > 0 && (<><span>VAT</span><span>{formatEur(round.vatCents)}</span></>)}
                <span className="font-semibold text-foreground">Client pays</span>
                <span className="font-semibold text-foreground">{formatEur(round.totalCents)}</span>
              </div>

              {round.proposedTimeline && (
                <p className="text-xs text-muted-foreground mt-2">Timeline: {round.proposedTimeline}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {canRespond ? (
          <div className="bg-white rounded-xl border border-border p-5">
            <RespondForm
              offerId={offer.id}
              currentPriceCents={offer.currentRound?.freelancerPriceCents ?? 0}
              vatRate={vatRate}
              vatLabel={vatLabel}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border p-5 text-sm text-muted-foreground text-center">
            {offer.status === "COUNTERED" && "Your counter-offer has been sent. Waiting for the client."}
            {offer.status === "ACCEPTED" && "This offer has been accepted. Your project will begin shortly."}
            {offer.status === "DECLINED" && "You declined this offer."}
            {offer.status === "WITHDRAWN" && "The client withdrew this offer."}
          </div>
        )}
      </main>
    </div>
  )
}
