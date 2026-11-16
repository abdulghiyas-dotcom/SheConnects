import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow, RowAmount } from "@/components/ui/list"
import { Eyebrow } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { PayoutMarkSentButton } from "./payout-mark-sent"
import { CreditCard, Wallet, Clock, AlertCircle } from "lucide-react"

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

  const statusLabel = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Payments & payouts" description="Client payments received and freelancer payouts sent." />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CreditCard} tone="emerald" value={formatEur(totalReceived)} label="Total received" />
        <StatCard icon={Wallet} tone="indigo" value={formatEur(totalPaidOut)} label="Total paid out" />
        <StatCard
          icon={Clock}
          tone="amber"
          value={pendingPayouts.length}
          label="Pending payouts"
          description={pendingPayouts.length > 0 ? "Needs action" : "All clear"}
        />
        <StatCard
          icon={AlertCircle}
          tone="red"
          value={failedCount}
          label="Failed payments"
          description={failedCount > 0 ? "Requires review" : "None"}
        />
      </div>

      {/* Pending payouts */}
      {pendingPayouts.length > 0 && (
        <ListSection title="Payouts to send" count={pendingPayouts.length} attention>
          {pendingPayouts.map((p) => (
            <ListRow key={p.id} title={p.freelancer.alias ?? "—"} subtitle={p.project?.title ?? "—"}>
              <RowAmount className="block font-bold text-slate-900">{formatEur(p.amountCents)}</RowAmount>
              <StatusBadge variant={PAYOUT_VARIANT[p.status] ?? "default"} label={statusLabel(p.status)} dot={false} />
              <PayoutMarkSentButton payoutId={p.id} />
            </ListRow>
          ))}
        </ListSection>
      )}

      {/* Client payments */}
      {payments.length === 0 ? (
        <section>
          <Eyebrow className="mb-3">Client payments</Eyebrow>
          <EmptyState icon={CreditCard} title="No payments yet" />
        </section>
      ) : (
        <ListSection title="Client payments" count={payments.length}>
          {payments.map((p) => (
            <ListRow
              key={p.id}
              title={p.project?.title ?? "—"}
              subtitle={
                <p className="truncate">
                  {p.client.organizationName}
                  {p.stripePaymentIntentId && (
                    <span className="font-mono text-slate-400"> · {p.stripePaymentIntentId.slice(0, 20)}…</span>
                  )}
                </p>
              }
            >
              <RowAmount className="block font-bold text-slate-900">{formatEur(p.totalCents)}</RowAmount>
              <StatusBadge variant={PAYMENT_VARIANT[p.status] ?? "default"} label={statusLabel(p.status)} dot={false} />
            </ListRow>
          ))}
        </ListSection>
      )}

      {/* Completed payouts */}
      {completedPayouts.length > 0 && (
        <ListSection title="Past payouts" count={completedPayouts.length}>
          {completedPayouts.map((p) => (
            <ListRow key={p.id} title={p.freelancer.alias ?? "—"} subtitle={p.project?.title ?? "—"}>
              <RowAmount className="block font-bold text-slate-900">{formatEur(p.amountCents)}</RowAmount>
              <StatusBadge variant={PAYOUT_VARIANT[p.status] ?? "default"} label={statusLabel(p.status)} dot={false} />
            </ListRow>
          ))}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
