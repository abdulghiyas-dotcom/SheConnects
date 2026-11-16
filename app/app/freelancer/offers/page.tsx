import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow, RowAmount } from "@/components/ui/list"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { Inbox } from "lucide-react"

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
      <ListRow
        href={`/app/freelancer/offers/${offer.id}`}
        title={offer.client.organizationName}
        subtitle={
          offer.currentRound?.proposedScope && (
            <p className="truncate">{offer.currentRound.proposedScope.slice(0, 70)}</p>
          )
        }
      >
        {offer.currentRound?.freelancerPriceCents && (
          <RowAmount>{formatEur(offer.currentRound.freelancerPriceCents)}</RowAmount>
        )}
        <StatusBadge
          variant={STATUS_VARIANT[offer.status] ?? "default"}
          label={STATUS_LABEL[offer.status] ?? offer.status}
          dot={false}
        />
      </ListRow>
    )
  }

  return (
    <PlatformLayout variant="freelancer">
      <PageHeader title="Offers" description="Offers from organisations — accept, counter or decline." />

      {offers.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No offers yet"
          description="Offers from organisations will appear here."
        />
      )}

      {pending.length > 0 && (
        <ListSection title="Needs your response" count={pending.length} attention>
          {pending.map((o) => <OfferRow key={o.id} offer={o} />)}
        </ListSection>
      )}

      {inProgress.length > 0 && (
        <ListSection title="In negotiation" count={inProgress.length}>
          {inProgress.map((o) => <OfferRow key={o.id} offer={o} />)}
        </ListSection>
      )}

      {past.length > 0 && (
        <ListSection title="Past" count={past.length}>
          {past.map((o) => <OfferRow key={o.id} offer={o} />)}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
