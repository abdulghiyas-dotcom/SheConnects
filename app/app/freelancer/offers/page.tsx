import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { Inbox, ArrowRight } from "lucide-react"
import Link from "next/link"

type StatusVariant = "pending" | "in_progress" | "completed" | "declined" | "cancelled" | "default"

const STATUS_LABEL: Record<string, string> = {
  SENT:      "New offer",
  COUNTERED: "Awaiting client",
  ACCEPTED:  "Accepted",
  DECLINED:  "Declined",
  WITHDRAWN: "Withdrawn",
  EXPIRED:   "Expired",
}

const STATUS_VARIANT: Record<string, StatusVariant> = {
  SENT:      "pending",
  COUNTERED: "in_progress",
  ACCEPTED:  "completed",
  DECLINED:  "declined",
  WITHDRAWN: "cancelled",
  EXPIRED:   "cancelled",
}

export default async function FreelancerOffersPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const offers = await prismaAdmin.offer.findMany({
    where: { freelancerId: freelancer!.id },
    include: {
      client:       { select: { organizationName: true } },
      currentRound: { select: { freelancerPriceCents: true, proposedTimeline: true, proposedScope: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const pending    = offers.filter((o) => o.status === "SENT")
  const inProgress = offers.filter((o) => ["COUNTERED", "CLIENT_REVIEWING"].includes(o.status))
  const past       = offers.filter((o) => ["ACCEPTED", "DECLINED", "WITHDRAWN", "EXPIRED"].includes(o.status))

  function OfferRow({ offer }: { offer: typeof offers[0] }) {
    return (
      <Link
        href={`/app/freelancer/offers/${offer.id}`}
        className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm text-slate-800 truncate">{offer.client.organizationName}</p>
          {offer.currentRound?.proposedScope && (
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {offer.currentRound.proposedScope.slice(0, 70)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {offer.currentRound?.freelancerPriceCents && (
            <span className="text-sm font-medium text-slate-700 tabular-nums hidden sm:block">
              {formatEur(offer.currentRound.freelancerPriceCents)}
            </span>
          )}
          <StatusBadge
            variant={STATUS_VARIANT[offer.status] ?? "default"}
            label={STATUS_LABEL[offer.status] ?? offer.status}
            dot={false}
          />
          <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <PlatformLayout variant="freelancer" title="Offers">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Offers</h1>

        {offers.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState
              icon={Inbox}
              title="No offers yet"
              description="Offers from organisations will appear here."
            />
          </div>
        )}

        {pending.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
              Needs your response ({pending.length})
            </h2>
            <div className="rounded-2xl border border-amber-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {pending.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {inProgress.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              In negotiation ({inProgress.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {inProgress.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Past ({past.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {past.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
