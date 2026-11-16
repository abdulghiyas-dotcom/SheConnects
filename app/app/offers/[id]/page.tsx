import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { NegotiationRounds } from "@/components/features/negotiation-rounds"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { StatusBadge } from "@/components/ui/status-badge"
import { ClientOfferActions } from "./offer-actions"

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

  const isOpen = ["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(offer.status)

  return (
    <PlatformLayout variant="client">
      <PageHeader
        back={{ href: "/app/offers", label: "All offers" }}
        title={
          <>
            Offer for{" "}
            <Link href={`/app/freelancers/${offer.freelancer.aliasSlug}`} className="text-indigo-600 hover:text-indigo-700">
              {offer.freelancer.alias}
            </Link>
          </>
        }
        badge={config && <StatusBadge variant={config.variant} label={config.label} />}
        description={`Sent ${new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NegotiationRounds
            rounds={offer.rounds}
            viewer="client"
            clientName="You"
            freelancerAlias={offer.freelancer.alias}
          />
        </div>

        <div className="space-y-4">
          {/* Accepted terms */}
          {offer.status === "ACCEPTED" && offer.acceptedFreelancerPriceCents && (
            <Card className="border-emerald-200 bg-emerald-50/50 p-6">
              <Eyebrow className="mb-4 flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 size={13} /> Agreed terms
              </Eyebrow>
              <PriceRows
                rows={[
                  { label: "Freelancer\u2019s fee", cents: offer.acceptedFreelancerPriceCents },
                  { label: "Platform fee", cents: offer.acceptedCommissionCents ?? 0 },
                  ...((offer.acceptedVatCents ?? 0) > 0 ? [{ label: "VAT", cents: offer.acceptedVatCents ?? 0 }] : []),
                ]}
                total={{ label: "Total", cents: offer.acceptedTotalCents ?? 0 }}
              />
              {offer.acceptedTimeline && (
                <p className="mt-3 text-xs text-slate-500">
                  Timeline: <span className="font-semibold text-slate-700">{offer.acceptedTimeline}</span>
                </p>
              )}
              {offer.project && (
                <Link
                  href={`/app/projects/${offer.project.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View project <ArrowRight size={14} />
                </Link>
              )}
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <Eyebrow className="mb-4">{isOpen ? "Your options" : "Status"}</Eyebrow>
            <ClientOfferActions offerId={offer.id} status={offer.status} />
            {!isOpen && <p className="text-sm text-slate-500">This offer is closed.</p>}
          </Card>
        </div>
      </div>
    </PlatformLayout>
  )
}
