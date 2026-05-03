import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatEur, getVatInfo } from "@/lib/utils/pricing"
import { RespondForm } from "./respond-form"
import { cn } from "@/lib/utils/cn"

type StatusVariant = "pending" | "in_progress" | "completed" | "declined" | "cancelled" | "default"

const STATUS_VARIANT: Record<string, StatusVariant> = {
  SENT:      "pending",
  COUNTERED: "in_progress",
  ACCEPTED:  "completed",
  DECLINED:  "declined",
  WITHDRAWN: "cancelled",
}

const STATUS_LABEL: Record<string, string> = {
  SENT:      "New — awaiting your response",
  COUNTERED: "Counter-offer sent",
  ACCEPTED:  "Accepted",
  DECLINED:  "Declined",
  WITHDRAWN: "Withdrawn by client",
}

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
          roundNumber: true, proposedBy: true, proposedScope: true,
          proposedTimeline: true, message: true, freelancerPriceCents: true,
          commissionCents: true, vatCents: true, totalCents: true, createdAt: true,
        },
      },
      currentRound: { select: { freelancerPriceCents: true } },
      project:      { select: { id: true } },
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
    <PlatformLayout variant="freelancer" title={`Offer from ${offer.client.organizationName}`}>
      <div className="max-w-3xl mx-auto space-y-6">

        <Link href="/app/freelancer/offers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} /> All offers
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Offer from {offer.client.organizationName}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Received {new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <StatusBadge
              variant={STATUS_VARIANT[offer.status] ?? "default"}
              label={STATUS_LABEL[offer.status] ?? offer.status}
            />
          </div>
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
                  round.proposedBy === "FREELANCER"
                    ? "border-brand-100 bg-brand-50/30 ml-4"
                    : "border-slate-100 ml-0"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {round.proposedBy === "CLIENT" ? offer.client.organizationName : "Your counter"}
                    {" "}· Round {round.roundNumber}
                  </p>
                  <p className="text-xs text-slate-400">{new Date(round.createdAt).toLocaleDateString("en-GB")}</p>
                </div>

                {round.proposedScope && (
                  <p className="text-sm text-slate-700 mb-3 whitespace-pre-line">{round.proposedScope}</p>
                )}
                {round.message && (
                  <p className="text-sm text-slate-500 italic mb-3">"{round.message}"</p>
                )}

                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3 mt-3">
                  <span>Your earnings</span><span className="text-right tabular-nums">{formatEur(round.freelancerPriceCents)}</span>
                  <span>Platform fee</span><span className="text-right tabular-nums">{formatEur(round.commissionCents)}</span>
                  {round.vatCents > 0 && (<><span>VAT</span><span className="text-right tabular-nums">{formatEur(round.vatCents)}</span></>)}
                  <span className="font-semibold text-slate-800">Client pays</span>
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
          {canRespond ? (
            <RespondForm
              offerId={offer.id}
              currentPriceCents={offer.currentRound?.freelancerPriceCents ?? 0}
              vatRate={vatRate}
              vatLabel={vatLabel}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center">
              {offer.status === "COUNTERED" && "Your counter-offer has been sent. Waiting for the client."}
              {offer.status === "ACCEPTED" && (
                <span>
                  This offer has been accepted.{" "}
                  {offer.project && (
                    <Link href={`/app/freelancer/projects/${offer.project.id}`} className="text-brand-600 hover:underline font-medium">
                      View your project →
                    </Link>
                  )}
                </span>
              )}
              {offer.status === "DECLINED" && "You declined this offer."}
              {offer.status === "WITHDRAWN" && "The client withdrew this offer."}
            </p>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}
