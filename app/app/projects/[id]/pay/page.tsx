import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ClientNav } from "@/components/features/client-nav"
import { PaymentForm } from "./payment-form"
import { formatEur } from "@/lib/utils/pricing"
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
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="projects" />

      <main className="max-w-lg mx-auto px-6 py-8 space-y-6">
        <Link href={`/app/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to project
        </Link>

        <div className="bg-white rounded-xl border border-border p-6 space-y-1">
          <h1 className="text-xl font-semibold">Pay for project</h1>
          <p className="text-sm text-muted-foreground">{project.title}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground mb-4">
            <span>Freelancer fee</span><span>{formatEur(project.payment.freelancerPriceCents)}</span>
            <span>Platform fee</span><span>{formatEur(project.payment.commissionCents)}</span>
            {project.payment.vatCents > 0 && (
              <><span>VAT</span><span>{formatEur(project.payment.vatCents)}</span></>
            )}
            <span className="font-semibold text-foreground pt-2 border-t border-border">Total</span>
            <span className="font-semibold text-foreground pt-2 border-t border-border">{formatEur(project.payment.totalCents)}</span>
          </div>

          <PaymentForm
            projectId={project.id}
            totalCents={project.payment.totalCents}
            publishableKey={publishableKey}
            stripeConfigured={isStripeConfigured}
          />
        </div>
      </main>
    </div>
  )
}
