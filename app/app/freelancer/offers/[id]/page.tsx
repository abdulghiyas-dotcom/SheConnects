import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { NegotiationRounds } from "@/components/features/negotiation-rounds"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { getVatInfo } from "@/lib/utils/pricing"
import { RespondForm } from "./respond-form"

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
    <PlatformLayout variant="freelancer">
      <PageHeader
        back={{ href: "/app/freelancer/offers", label: "All offers" }}
        title={`Offer from ${offer.client.organizationName}`}
        badge={
          <StatusBadge
            variant={STATUS_VARIANT[offer.status] ?? "default"}
            label={STATUS_LABEL[offer.status] ?? offer.status}
          />
        }
        description={`Received ${new Date(offer.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NegotiationRounds
            rounds={offer.rounds}
            viewer="freelancer"
            clientName={offer.client.organizationName}
            freelancerAlias="You"
          />
        </div>

        {/* Actions */}
        <div>
          <Card className="p-6">
            <Eyebrow className="mb-4">{canRespond ? "Your response" : "Status"}</Eyebrow>
            {canRespond ? (
              <RespondForm
                offerId={offer.id}
                currentPriceCents={offer.currentRound?.freelancerPriceCents ?? 0}
                vatRate={vatRate}
                vatLabel={vatLabel}
              />
            ) : (
              <div className="text-sm leading-relaxed text-slate-500">
                {offer.status === "COUNTERED" && "Your counter-offer has been sent. Waiting for the client."}
                {offer.status === "ACCEPTED" && (
                  <>
                    <p>This offer has been accepted.</p>
                    {offer.project && (
                      <Link
                        href={`/app/freelancer/projects/${offer.project.id}`}
                        className="mt-3 inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        View your project <ArrowRight size={14} />
                      </Link>
                    )}
                  </>
                )}
                {offer.status === "DECLINED" && "You declined this offer."}
                {offer.status === "WITHDRAWN" && "The client withdrew this offer."}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PlatformLayout>
  )
}
