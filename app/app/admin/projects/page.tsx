import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { FolderOpen } from "lucide-react"

type StatusVariant = "pending" | "in_progress" | "completed" | "cancelled" | "declined" | "default"

const STATUS_VARIANT: Record<string, StatusVariant> = {
  AWAITING_KICKOFF:   "pending",
  IN_PROGRESS:        "in_progress",
  IN_REVIEW:          "in_progress",
  REVISION_REQUESTED: "pending",
  COMPLETED:          "completed",
  CANCELLED:          "cancelled",
  DISPUTED:           "declined",
}

const PAYMENT_VARIANT: Record<string, StatusVariant> = {
  SUCCEEDED: "completed",
  FAILED:    "declined",
  PENDING:   "pending",
}

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const projects = await prismaAdmin.project.findMany({
    include: {
      client:     { select: { organizationName: true } },
      freelancer: { select: { alias: true } },
      milestones: { select: { status: true } },
      payment:    { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = projects.filter((p) =>
    ["AWAITING_KICKOFF", "IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED", "AWAITING_APPROVAL"].includes(p.status)
  )
  const past = projects.filter((p) => ["COMPLETED", "CANCELLED", "DISPUTED"].includes(p.status))

  function Row({ p }: { p: typeof projects[0] }) {
    const approved = p.milestones.filter((m) => m.status === "APPROVED").length
    const total    = p.milestones.length
    const progress = total > 0 ? Math.round((approved / total) * 100) : 0

    return (
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-slate-800 truncate">{p.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-400">
              {p.client.organizationName} → {p.freelancer.alias ?? "—"}
            </p>
            {total > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-trust-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-slate-400">{approved}/{total}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-slate-700 tabular-nums hidden sm:block">
            {formatEur(p.totalCents)}
          </span>
          {p.payment && (
            <StatusBadge
              variant={PAYMENT_VARIANT[p.payment.status] ?? "default"}
              label={p.payment.status === "SUCCEEDED" ? "Paid" : p.payment.status === "FAILED" ? "Failed" : "Unpaid"}
              dot={false}
            />
          )}
          <StatusBadge
            variant={STATUS_VARIANT[p.status] ?? "default"}
            label={p.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            dot={false}
          />
        </div>
      </div>
    )
  }

  return (
    <PlatformLayout variant="admin" title="Projects">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>

        {projects.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState icon={FolderOpen} title="No projects yet" />
          </div>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Active ({active.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {active.map((p) => <Row key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Past ({past.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {past.map((p) => <Row key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
