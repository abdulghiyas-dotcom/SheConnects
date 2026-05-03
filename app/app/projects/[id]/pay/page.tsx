import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
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
    <PlatformLayout variant="client" title="Pay for project">
      <div className="max-w-lg mx-auto space-y-6">
        <Link href={`/app/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} /> Back to project
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
          <h1 className="text-xl font-bold text-slate-900">Pay for project</h1>
          <p className="text-sm text-slate-500 mt-1">{project.title}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Order summary</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-500 mb-4">
            <span>Freelancer fee</span><span className="text-right tabular-nums">{formatEur(project.payment.freelancerPriceCents)}</span>
            <span>Platform fee</span><span className="text-right tabular-nums">{formatEur(project.payment.commissionCents)}</span>
            {project.payment.vatCents > 0 && (
              <><span>VAT</span><span className="text-right tabular-nums">{formatEur(project.payment.vatCents)}</span></>
            )}
            <span className="font-semibold text-slate-800 pt-2 border-t border-slate-100">Total</span>
            <span className="font-semibold text-slate-800 pt-2 border-t border-slate-100 text-right tabular-nums">{formatEur(project.payment.totalCents)}</span>
          </div>

          <PaymentForm
            projectId={project.id}
            totalCents={project.payment.totalCents}
            publishableKey={publishableKey}
            stripeConfigured={isStripeConfigured}
          />
        </div>
      </div>
    </PlatformLayout>
  )
}
