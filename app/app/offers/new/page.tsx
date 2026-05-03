import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { getVatInfo } from "@/lib/utils/pricing"
import { PlatformLayout } from "@/components/features/platform-layout"
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
    <PlatformLayout variant="client" title="New Offer">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/app/freelancers/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft size={14} /> Back to {freelancer.alias}&apos;s profile
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Send an offer to {freelancer.alias}</h1>
            {freelancer.tagline && (
              <p className="text-sm text-slate-500 mt-1">{freelancer.tagline}</p>
            )}
          </div>

          <OfferForm
            freelancerSlug={slug}
            freelancerAlias={freelancer.alias}
            vatRate={vatRate}
            vatLabel={vatLabel}
          />
        </div>
      </div>
    </PlatformLayout>
  )
}
