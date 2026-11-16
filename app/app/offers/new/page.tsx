import { notFound, redirect } from "next/navigation"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { getVatInfo } from "@/lib/utils/pricing"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card } from "@/components/ui/card"
import { OfferForm } from "./offer-form"

export default async function NewOfferPage({
  searchParams,
}: {
  searchParams: { freelancer?: string }
}) {
  const user = await requireRole("CLIENT")

  const slug = searchParams.freelancer
  if (!slug) notFound()

  const [freelancer, client] = await Promise.all([
    prismaAdmin.freelancer.findUnique({
      where: { aliasSlug: slug, status: "ACTIVE" },
      select: { alias: true, aliasSlug: true, tagline: true, track: true, acceptingOffers: true },
    }),
    prismaAdmin.client.findUnique({
      where: { userId: user.id },
      select: { billingCountry: true },
    }),
  ])

  if (!freelancer || !freelancer.acceptingOffers) notFound()

  const { vatRate, vatRegime } = getVatInfo(client?.billingCountry ?? null)

  const vatLabel =
    vatRegime === "IT_DOMESTIC" ? "IVA (22%)"
    : vatRegime === "EU_B2B"   ? "VAT (0% — reverse charge)"
    : "VAT (0%)"

  return (
    <PlatformLayout variant="client">
      <PageHeader
        back={{ href: `/app/freelancers/${slug}`, label: `Back to ${freelancer.alias}\u2019s profile` }}
        title={`Send an offer to ${freelancer.alias}`}
        description={freelancer.tagline}
      />

      <Card className="max-w-2xl p-6 sm:p-8">
        <OfferForm
          freelancerSlug={slug}
          freelancerAlias={freelancer.alias}
          vatRate={vatRate}
          vatLabel={vatLabel}
        />
      </Card>
    </PlatformLayout>
  )
}
