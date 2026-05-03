import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { PayoutMarkSentButton } from "./payout-mark-sent"
import { CreditCard, DollarSign, Clock, AlertCircle } from "lucide-react"

type StatusVariant = "pending" | "in_progress" | "completed" | "declined" | "default"

const PAYMENT_VARIANT: Record<string, StatusVariant> = {
  PENDING:    "pending",
  PROCESSING: "in_progress",
  SUCCEEDED:  "completed",
  FAILED:     "declined",
}

const PAYOUT_VARIANT: Record<string, StatusVariant> = {
  SCHEDULED:  "pending",
  QUEUED:     "in_progress",
  PROCESSING: "in_progress",
  SENT:       "completed",
  DELIVERED:  "completed",
  FAILED:     "declined",
}

export default async function AdminPaymentsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const [payments, payouts] = await Promise.all([
    prismaAdmin.payment.findMany({
      include: {
        client:  { select: { organizationName: true } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prismaAdmin.payout.findMany({
      include: {
        freelancer: { select: { alias: true } },
        project:    { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  const pendingPayouts   = payouts.filter((p) => ["SCHEDULED", "QUEUED"].includes(p.status))
  const completedPayouts = payouts.filter((p) => !["SCHEDULED", "QUEUED"].includes(p.status))

  const totalReceived = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.totalCents, 0)
  const totalPaidOut = payouts
    .filter((p) => ["SENT", "DELIVERED"].includes(p.status))
    .reduce((sum, p) => sum + p.amountCents, 0)
  const failedCount = payments.filter((p) => p.status === "FAILED").length

  return (
    <PlatformLayout variant="admin" title="Payments & Payouts">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments & Payouts</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={CreditCard} iconBg="bg-trust-50" iconColor="text-trust-600"
            value={formatEur(totalReceived)} label="Total received" />
          <StatCard icon={DollarSign} iconBg="bg-brand-50" iconColor="text-brand-600"
            value={formatEur(totalPaidOut)} label="Total paid out" />
          <StatCard icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600"
            value={pendingPayouts.length} label="Pending payouts"
            description={pendingPayouts.length > 0 ? "Needs action" : "All clear"} />
          <StatCard icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-500"
            value={failedCount} label="Failed payments"
            description={failedCount > 0 ? "Requires review" : "None"} />
        </div>

        {/* Pending payouts */}
        {pendingPayouts.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
              Payouts to send ({pendingPayouts.length})
            </h2>
            <div className="rounded-2xl border border-amber-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {pendingPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800">{p.freelancer.alias ?? "—"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.project?.title ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatEur(p.amountCents)}</span>
                    <StatusBadge variant={PAYOUT_VARIANT[p.status] ?? "default"} label={p.status} dot={false} />
                    <PayoutMarkSentButton payoutId={p.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Client payments */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Client payments ({payments.length})
          </h2>
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
              <EmptyState icon={CreditCard} title="No payments yet" />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{p.project?.title ?? "—"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.client.organizationName}
                      {p.stripePaymentIntentId ? ` · ${p.stripePaymentIntentId.slice(0, 20)}…` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatEur(p.totalCents)}</span>
                    <StatusBadge variant={PAYMENT_VARIANT[p.status] ?? "default"} label={p.status} dot={false} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed payouts */}
        {completedPayouts.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Past payouts ({completedPayouts.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {completedPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800">{p.freelancer.alias ?? "—"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.project?.title ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatEur(p.amountCents)}</span>
                    <StatusBadge variant={PAYOUT_VARIANT[p.status] ?? "default"} label={p.status} dot={false} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
