import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { FreelancerNav } from "@/components/features/freelancer-nav"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

const STATUS_LABEL: Record<string, string> = {
  SENT:      "New offer",
  COUNTERED: "Awaiting client",
  ACCEPTED:  "Accepted",
  DECLINED:  "Declined",
  WITHDRAWN: "Withdrawn",
  EXPIRED:   "Expired",
}

const STATUS_CLASS: Record<string, string> = {
  SENT:      "bg-amber-50 text-amber-700",
  COUNTERED: "bg-brand-50 text-brand-700",
  ACCEPTED:  "bg-trust-50 text-trust-700",
  DECLINED:  "bg-red-50 text-red-600",
  WITHDRAWN: "bg-secondary text-muted-foreground",
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
      client: { select: { organizationName: true } },
      currentRound: { select: { freelancerPriceCents: true, proposedTimeline: true, proposedScope: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const pending = offers.filter((o) => ["SENT"].includes(o.status))
  const inProgress = offers.filter((o) => ["COUNTERED", "CLIENT_REVIEWING"].includes(o.status))
  const past = offers.filter((o) => ["ACCEPTED", "DECLINED", "WITHDRAWN", "EXPIRED"].includes(o.status))

  function OfferRow({ offer }: { offer: typeof offers[0] }) {
    return (
      <Link
        href={`/app/freelancer/offers/${offer.id}`}
        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-secondary/40 rounded-lg transition-colors"
      >
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{offer.client.organizationName}</p>
          {offer.currentRound?.proposedScope && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {offer.currentRound.proposedScope.slice(0, 70)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {offer.currentRound?.freelancerPriceCents && (
            <span className="text-sm text-muted-foreground">{formatEur(offer.currentRound.freelancerPriceCents)}</span>
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
      <FreelancerNav active="offers" />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Offers</h1>

        {offers.length === 0 && (
          <p className="text-muted-foreground">No offers yet — they'll appear here when clients reach out.</p>
        )}

        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">New — needs your response</h2>
            <div className="bg-white rounded-xl border border-amber-200 divide-y divide-border">
              {pending.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {inProgress.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">In negotiation</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {inProgress.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {past.map((o) => <OfferRow key={o.id} offer={o} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
