import { notFound, redirect } from "next/navigation"
import { Lock } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { PaymentForm } from "./payment-form"
import { isStripeConfigured } from "@/lib/services/stripe"

export default async function PayProjectPage({ params }: { params: { id: string } }) {
  const user = await requireRole("CLIENT")

  const client = await prismaAdmin.client.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const project = await prismaAdmin.project.findUnique({
    where: { id: params.id, clientId: client!.id },
    include: { payment: true },
  })

  if (!project) notFound()
  if (!project.payment) redirect(`/app/projects/${params.id}`)
  if (project.payment.status === "SUCCEEDED") redirect(`/app/projects/${params.id}?payment=already_paid`)

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""

  return (
    <PlatformLayout variant="client">
      <PageHeader
        back={{ href: `/app/projects/${project.id}`, label: "Back to project" }}
        title="Pay for project"
        description={project.title}
      />

      <div className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <Eyebrow className="mb-4">Payment details</Eyebrow>
          <PaymentForm
            projectId={project.id}
            totalCents={project.payment.totalCents}
            publishableKey={publishableKey}
            stripeConfigured={isStripeConfigured}
          />
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <Eyebrow className="mb-4">Order summary</Eyebrow>
            <PriceRows
              rows={[
                { label: "Freelancer fee", cents: project.payment.freelancerPriceCents },
                { label: "Platform fee", cents: project.payment.commissionCents },
                ...(project.payment.vatCents > 0 ? [{ label: "VAT", cents: project.payment.vatCents }] : []),
              ]}
              total={{ label: "Total", cents: project.payment.totalCents }}
            />
          </Card>
          <p className="mt-4 flex items-center gap-1.5 px-1 text-xs text-slate-400">
            <Lock size={12} className="text-emerald-500" />
            Payments are processed securely by Stripe.
          </p>
        </div>
      </div>
    </PlatformLayout>
  )
}
