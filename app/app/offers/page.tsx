import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ClientNav } from "@/components/features/client-nav"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"

const STATUS_LABEL: Record<string, string> = {
  SENT:             "Awaiting response",
  COUNTERED:        "Counter-offer received",
  CLIENT_REVIEWING: "Under review",
  ACCEPTED:         "Accepted",
  DECLINED:         "Declined",
  WITHDRAWN:        "Withdrawn",
  EXPIRED:          "Expired",
  CONTRACTED:       "Contracted",
  DRAFT:            "Draft",
}

const STATUS_CLASS: Record<string, string> = {
  SENT:       "bg-amber-50 text-amber-700",
  COUNTERED:  "bg-brand-50 text-brand-700",
  ACCEPTED:   "bg-trust-50 text-trust-700",
  DECLINED:   "bg-red-50 text-red-600",
  WITHDRAWN:  "bg-secondary text-muted-foreground",
  EXPIRED:    "bg-secondary text-muted-foreground",
  CONTRACTED: "bg-trust-50 text-trust-700",
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
      freelancer: { select: { alias: true, aliasSlug: true } },
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
        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-secondary/40 rounded-lg transition-colors"
      >
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{offer.freelancer.alias}</p>
          {offer.currentRound?.proposedScope && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {offer.currentRound.proposedScope.slice(0, 80)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {offer.currentRound?.totalCents && (
            <span className="text-sm text-muted-foreground">{formatEur(offer.currentRound.totalCents)}</span>
          )}
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_CLASS[offer.status] ?? "bg-secondary text-muted-foreground")}>
            {STATUS_LABEL[offer.status] ?? offer.status}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="offers" />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Offers</h1>

        {offers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No offers yet</p>
            <p className="text-sm mt-1">
              Browse freelancers and send your first offer.
            </p>
            <Link href="/app/freelancers" className="text-primary text-sm hover:underline mt-3 inline-block">
              Browse freelancers →
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Active
            </h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {active.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {closed.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Past
            </h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {closed.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
