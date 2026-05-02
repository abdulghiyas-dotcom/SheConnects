import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"
import { PayoutMarkSentButton } from "./payout-mark-sent"

const PAYMENT_CLASS: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700",
  PROCESSING: "bg-brand-50 text-brand-700",
  SUCCEEDED:  "bg-trust-50 text-trust-700",
  FAILED:     "bg-red-50 text-red-600",
}

const PAYOUT_CLASS: Record<string, string> = {
  SCHEDULED:  "bg-amber-50 text-amber-700",
  QUEUED:     "bg-brand-50 text-brand-700",
  PROCESSING: "bg-brand-50 text-brand-700",
  SENT:       "bg-trust-50 text-trust-700",
  DELIVERED:  "bg-trust-50 text-trust-700",
  FAILED:     "bg-red-50 text-red-600",
}

export default async function AdminPaymentsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const [payments, payouts] = await Promise.all([
    prismaAdmin.payment.findMany({
      include: {
        client: { select: { organizationName: true } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prismaAdmin.payout.findMany({
      include: {
        freelancer: { select: { alias: true } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  const pendingPayouts = payouts.filter((p) => ["SCHEDULED", "QUEUED"].includes(p.status))
  const completedPayouts = payouts.filter((p) => !["SCHEDULED", "QUEUED"].includes(p.status))

  const totalReceived = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.totalCents, 0)
  const totalPaidOut = payouts
    .filter((p) => ["SENT", "DELIVERED"].includes(p.status))
    .reduce((sum, p) => sum + p.amountCents, 0)

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="payments" />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Payments & Payouts</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total received",   value: formatEur(totalReceived) },
            { label: "Total paid out",   value: formatEur(totalPaidOut) },
            { label: "Pending payouts",  value: pendingPayouts.length.toString() },
            { label: "Failed payments",  value: payments.filter((p) => p.status === "FAILED").length.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Pending payouts */}
        {pendingPayouts.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Payouts to send ({pendingPayouts.length})
            </h2>
            <div className="bg-white rounded-xl border border-amber-200 divide-y divide-border">
              {pendingPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{p.freelancer.alias ?? "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.project?.title ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-medium text-sm">{formatEur(p.amountCents)}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PAYOUT_CLASS[p.status])}>
                      {p.status}
                    </span>
                    <PayoutMarkSentButton payoutId={p.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Client payments */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Client payments</h2>
          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            {payments.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-sm">No payments yet.</p>
            )}
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.project?.title ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.client.organizationName}
                    {p.stripePaymentIntentId ? ` · ${p.stripePaymentIntentId.slice(0, 20)}…` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium">{formatEur(p.totalCents)}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PAYMENT_CLASS[p.status] ?? "bg-secondary text-muted-foreground")}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed payouts */}
        {completedPayouts.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past payouts</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {completedPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{p.freelancer.alias ?? "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.project?.title ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium">{formatEur(p.amountCents)}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PAYOUT_CLASS[p.status] ?? "bg-secondary text-muted-foreground")}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
