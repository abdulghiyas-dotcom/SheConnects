import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatEur } from "@/lib/utils/pricing"
import { ClientOfferActions } from "./offer-actions"
import { cn } from "@/lib/utils/cn"

type StatusVariant = "pending" | "in_progress" | "completed" | "declined" | "cancelled" | "default"

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; variant: StatusVariant }> = {
  SENT:       { label: "Awaiting freelancer response", icon: Clock,        variant: "pending" },
  COUNTERED:  { label: "Counter-offer received",       icon: Clock,        variant: "in_progress" },
  ACCEPTED:   { label: "Offer accepted",               icon: CheckCircle2, variant: "completed" },
  DECLINED:   { label: "Offer declined",               icon: XCircle,      variant: "declined" },
  WITHDRAWN:  { label: "Offer withdrawn",              icon: XCircle,      variant: "cancelled" },
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
      project:    { select: { id: true } },
      rounds: {
        orderBy: { roundNumber: "asc" },
        select: {
          roundNumber: true, proposedBy: true, proposedScope: true,
          proposedTimeline: true, message: true, freelancerPriceCents: true,
          commissionCents: true, vatCents: true, totalCents: true, createdAt: true,
        },
      },
    },
  })

  if (!offer) notFound()

  const config = STATUS_CONFIG[offer.status]

  return (
    <PlatformLayout variant="client" title={`Offer — ${offer.freelancer.alias}`}>
      <div className="max-w-3xl mx-auto space-y-6">

        <Link href="/app/offers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} /> All offers
        </Link>

        {/* Header card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Offer for{" "}
                <Link href={`/app/freelancers/${offer.freelancer.aliasSlug}`} className="text-brand-600 hover:underline">
                  {offer.freelancer.alias}
                </Link>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sent {new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            {config && (
              <StatusBadge variant={config.variant} label={config.label} />
            )}
          </div>

          {/* Accepted terms */}
          {offer.status === "ACCEPTED" && offer.acceptedFreelancerPriceCents && (
            <div className="mt-5 rounded-xl border border-trust-200 bg-trust-50 p-4">
              <p className="text-sm font-semibold text-trust-800 mb-3">Agreed terms</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-trust-700">
                <span>Freelancer's fee</span><span className="text-right tabular-nums">{formatEur(offer.acceptedFreelancerPriceCents)}</span>
                <span>Platform fee</span><span className="text-right tabular-nums">{formatEur(offer.acceptedCommissionCents ?? 0)}</span>
                {(offer.acceptedVatCents ?? 0) > 0 && (
                  <><span>VAT</span><span className="text-right tabular-nums">{formatEur(offer.acceptedVatCents ?? 0)}</span></>
                )}
                <span className="font-semibold pt-1 border-t border-trust-200">Total</span>
                <span className="text-right font-semibold tabular-nums pt-1 border-t border-trust-200">{formatEur(offer.acceptedTotalCents ?? 0)}</span>
              </div>
              {offer.acceptedTimeline && (
                <p className="text-xs text-trust-700 mt-2">Timeline: {offer.acceptedTimeline}</p>
              )}
              {offer.project && (
                <Link href={`/app/projects/${offer.project.id}`} className="mt-3 inline-block text-xs font-semibold text-trust-700 hover:underline">
                  View project →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Negotiation rounds */}
        {offer.rounds.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Negotiation history</h2>
            {offer.rounds.map((round) => (
              <div
                key={round.roundNumber}
                className={cn(
                  "rounded-2xl border bg-white shadow-card p-5",
                  round.proposedBy === "CLIENT"
                    ? "border-slate-100 ml-0"
                    : "border-brand-100 bg-brand-50/30 ml-4"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {round.proposedBy === "CLIENT" ? "Your offer" : `${offer.freelancer.alias}'s counter`}
                    {" "}· Round {round.roundNumber}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(round.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {round.proposedScope && (
                  <p className="text-sm text-slate-700 mb-3 whitespace-pre-line">{round.proposedScope}</p>
                )}
                {round.message && (
                  <p className="text-sm text-slate-500 italic mb-3">"{round.message}"</p>
                )}

                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3 mt-3">
                  <span>Freelancer fee</span><span className="text-right tabular-nums">{formatEur(round.freelancerPriceCents)}</span>
                  <span>Platform fee</span><span className="text-right tabular-nums">{formatEur(round.commissionCents)}</span>
                  {round.vatCents > 0 && (<><span>VAT</span><span className="text-right tabular-nums">{formatEur(round.vatCents)}</span></>)}
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="text-right font-semibold text-slate-800 tabular-nums">{formatEur(round.totalCents)}</span>
                </div>

                {round.proposedTimeline && (
                  <p className="text-xs text-slate-400 mt-2">Timeline: {round.proposedTimeline}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
          <ClientOfferActions offerId={offer.id} status={offer.status} />
          {!["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(offer.status) && (
            <p className="text-sm text-slate-400 text-center">This offer is closed.</p>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}
