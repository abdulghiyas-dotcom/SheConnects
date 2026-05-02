import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ClientNav } from "@/components/features/client-nav"
import { formatEur } from "@/lib/utils/pricing"
import { ClientOfferActions } from "./offer-actions"
import { cn } from "@/lib/utils/cn"

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  SENT:       { label: "Awaiting freelancer response", icon: Clock,        class: "text-amber-600 bg-amber-50" },
  COUNTERED:  { label: "Counter-offer received",       icon: Clock,        class: "text-brand-700 bg-brand-50" },
  ACCEPTED:   { label: "Offer accepted",               icon: CheckCircle2, class: "text-trust-700 bg-trust-50" },
  DECLINED:   { label: "Offer declined",               icon: XCircle,      class: "text-red-600 bg-red-50" },
  WITHDRAWN:  { label: "Offer withdrawn",              icon: XCircle,      class: "text-muted-foreground bg-secondary" },
}

export default async function ClientOfferDetailPage({ params }: { params: { id: string } }) {
  const user = await requireRole("CLIENT")

  const client = await prismaAdmin.client.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const offer = await prismaAdmin.offer.findUnique({
    where: { id: params.id, clientId: client!.id },
    include: {
      freelancer: { select: { alias: true, aliasSlug: true } },
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
    },
  })

  if (!offer) notFound()

  const config = STATUS_CONFIG[offer.status]
  const StatusIcon = config?.icon ?? Clock

  return (
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="offers" />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/app/offers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> All offers
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Offer for{" "}
                <Link href={`/app/freelancers/${offer.freelancer.aliasSlug}`} className="hover:underline">
                  {offer.freelancer.alias}
                </Link>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Sent {new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            {config && (
              <div className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shrink-0", config.class)}>
                <StatusIcon size={13} />
                {config.label}
              </div>
            )}
          </div>

          {/* Accepted terms summary */}
          {offer.status === "ACCEPTED" && offer.acceptedFreelancerPriceCents && (
            <div className="mt-4 rounded-lg bg-trust-50 border border-trust-200 p-4 text-sm">
              <p className="font-medium text-trust-800 mb-2">Agreed terms</p>
              <div className="grid grid-cols-2 gap-1 text-trust-700 text-xs">
                <span>Freelancer's fee</span><span className="text-right">{formatEur(offer.acceptedFreelancerPriceCents)}</span>
                <span>Platform fee</span><span className="text-right">{formatEur(offer.acceptedCommissionCents ?? 0)}</span>
                {(offer.acceptedVatCents ?? 0) > 0 && (<><span>VAT</span><span className="text-right">{formatEur(offer.acceptedVatCents ?? 0)}</span></>)}
                <span className="font-semibold">Total</span><span className="text-right font-semibold">{formatEur(offer.acceptedTotalCents ?? 0)}</span>
              </div>
              {offer.acceptedTimeline && (
                <p className="text-xs text-trust-700 mt-2">Timeline: {offer.acceptedTimeline}</p>
              )}
            </div>
          )}
        </div>

        {/* Negotiation history */}
        <div className="space-y-3">
          {offer.rounds.map((round) => (
            <div key={round.roundNumber} className={cn(
              "bg-white rounded-xl border border-border p-5",
              round.proposedBy === "CLIENT" ? "ml-0" : "ml-4"
            )}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {round.proposedBy === "CLIENT" ? "Your offer" : `${offer.freelancer.alias}'s counter`} · Round {round.roundNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(round.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              {round.proposedScope && (
                <p className="text-sm text-foreground mb-3 whitespace-pre-line">{round.proposedScope}</p>
              )}

              {round.message && (
                <p className="text-sm text-muted-foreground italic mb-3">"{round.message}"</p>
              )}

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                <span>Freelancer fee</span><span>{formatEur(round.freelancerPriceCents)}</span>
                <span>Platform fee</span><span>{formatEur(round.commissionCents)}</span>
                {round.vatCents > 0 && (<><span>VAT</span><span>{formatEur(round.vatCents)}</span></>)}
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-foreground">{formatEur(round.totalCents)}</span>
              </div>

              {round.proposedTimeline && (
                <p className="text-xs text-muted-foreground mt-2">Timeline: {round.proposedTimeline}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-border p-5">
          <ClientOfferActions offerId={offer.id} status={offer.status} />
          {!["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(offer.status) && (
            <p className="text-sm text-muted-foreground text-center">This offer is closed.</p>
          )}
        </div>
      </main>
    </div>
  )
}
