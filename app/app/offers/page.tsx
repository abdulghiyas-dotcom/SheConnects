import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { formatEur } from "@/lib/utils/pricing"
import { Inbox, ArrowRight } from "lucide-react"

type StatusVariant = "pending" | "in_progress" | "completed" | "declined" | "cancelled" | "default"

const STATUS_LABEL: Record<string, string> = {
  SENT:             "Awaiting response",
  COUNTERED:        "Counter-offer",
  CLIENT_REVIEWING: "Under review",
  ACCEPTED:         "Accepted",
  DECLINED:         "Declined",
  WITHDRAWN:        "Withdrawn",
  EXPIRED:          "Expired",
  CONTRACTED:       "Contracted",
  DRAFT:            "Draft",
}

const STATUS_VARIANT: Record<string, StatusVariant> = {
  SENT:             "pending",
  COUNTERED:        "in_progress",
  CLIENT_REVIEWING: "pending",
  ACCEPTED:         "completed",
  DECLINED:         "declined",
  WITHDRAWN:        "cancelled",
  EXPIRED:          "cancelled",
  CONTRACTED:       "completed",
}

export default async function OffersPage() {
  const user = await requireRole("CLIENT")

  const client = await prismaAdmin.client.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const offers = await prismaAdmin.offer.findMany({
    where: { clientId: client!.id },
    include: {
      freelancer:   { select: { alias: true, aliasSlug: true } },
      currentRound: { select: { totalCents: true, proposedTimeline: true, proposedScope: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const active = offers.filter((o) => ["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(o.status))
  const closed = offers.filter((o) => !["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(o.status))

  function OfferRow({ offer }: { offer: typeof offers[0] }) {
    return (
      <Link
        href={`/app/offers/${offer.id}`}
        className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm text-slate-800 truncate">{offer.freelancer.alias}</p>
          {offer.currentRound?.proposedScope && (
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {offer.currentRound.proposedScope.slice(0, 80)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {offer.currentRound?.totalCents && (
            <span className="text-sm font-medium text-slate-700 tabular-nums">
              {formatEur(offer.currentRound.totalCents)}
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
    <PlatformLayout variant="client" title="Offers">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Offers</h1>
          <Button asChild size="sm" className="rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand">
            <Link href="/app/freelancers">Browse freelancers</Link>
          </Button>
        </div>

        {offers.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState
              icon={Inbox}
              title="No offers yet"
              description="Browse the freelancer directory and send your first offer."
              action={
                <Button asChild size="sm" className="rounded-xl bg-brand-600 hover:bg-brand-700">
                  <Link href="/app/freelancers">Browse freelancers</Link>
                </Button>
              }
            />
          </div>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Active ({active.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {active.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {closed.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Past ({closed.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {closed.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
