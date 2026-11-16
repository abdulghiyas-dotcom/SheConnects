import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow, RowAmount } from "@/components/ui/list"
import { ProgressBar } from "@/components/ui/progress-bar"
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

    return (
      <ListRow
        title={p.title}
        subtitle={
          <div className="flex items-center gap-3">
            <span className="truncate">
              {p.client.organizationName} → {p.freelancer.alias ?? "—"}
            </span>
            {total > 0 && <ProgressBar value={approved} max={total} size="sm" className="w-28 flex-shrink-0" />}
          </div>
        }
      >
        <RowAmount>{formatEur(p.totalCents)}</RowAmount>
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
      </ListRow>
    )
  }

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Projects" description={`${active.length} active · ${past.length} past`} />

      {projects.length === 0 && <EmptyState icon={FolderOpen} title="No projects yet" />}

      {active.length > 0 && (
        <ListSection title="Active" count={active.length}>
          {active.map((p) => <Row key={p.id} p={p} />)}
        </ListSection>
      )}

      {past.length > 0 && (
        <ListSection title="Past" count={past.length}>
          {past.map((p) => <Row key={p.id} p={p} />)}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
