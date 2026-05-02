import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { getVatInfo } from "@/lib/utils/pricing"
import { ClientNav } from "@/components/features/client-nav"
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
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="offers" />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link
          href={`/app/freelancers/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={14} /> Back to {freelancer.alias}'s profile
        </Link>

        <div className="bg-white rounded-xl border border-border p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Send an offer to {freelancer.alias}</h1>
            {freelancer.tagline && (
              <p className="text-sm text-muted-foreground mt-1">{freelancer.tagline}</p>
            )}
          </div>

          <OfferForm
            freelancerSlug={slug}
            freelancerAlias={freelancer.alias}
            vatRate={vatRate}
            vatLabel={vatLabel}
          />
        </div>
      </main>
    </div>
  )
}
