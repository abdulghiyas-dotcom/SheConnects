import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow, RowAmount } from "@/components/ui/list"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { formatEur } from "@/lib/utils/pricing"
import { Inbox } from "lucide-react"

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
      <ListRow
        href={`/app/offers/${offer.id}`}
        title={offer.freelancer.alias}
        subtitle={
          offer.currentRound?.proposedScope && (
            <p className="truncate">{offer.currentRound.proposedScope.slice(0, 80)}</p>
          )
        }
      >
        {offer.currentRound?.totalCents && (
          <RowAmount>{formatEur(offer.currentRound.totalCents)}</RowAmount>
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
    <PlatformLayout variant="client">
      <PageHeader
        title="Offers"
        description="Offers you've sent to freelancers and where each one stands."
        actions={
          offers.length > 0 && (
            <Button asChild>
              <Link href="/app/freelancers">Browse freelancers</Link>
            </Button>
          )
        }
      />

      {offers.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No offers yet"
          description="Browse the freelancer directory and send your first offer."
          action={
            <Button asChild>
              <Link href="/app/freelancers">Browse freelancers</Link>
            </Button>
          }
        />
      )}

      {active.length > 0 && (
        <ListSection title="Active" count={active.length}>
          {active.map((o) => <OfferRow key={o.id} offer={o} />)}
        </ListSection>
      )}

      {closed.length > 0 && (
        <ListSection title="Past" count={closed.length}>
          {closed.map((o) => <OfferRow key={o.id} offer={o} />)}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
