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

type StatusVariant = "pending" | "in_progress" | "completed" | "cancelled" | "default"

const STATUS_LABEL: Record<string, string> = {
  AWAITING_KICKOFF:   "Awaiting kickoff",
  IN_PROGRESS:        "In progress",
  IN_REVIEW:          "In review",
  REVISION_REQUESTED: "Revision needed",
  COMPLETED:          "Completed",
  CANCELLED:          "Cancelled",
}

const STATUS_VARIANT: Record<string, StatusVariant> = {
  AWAITING_KICKOFF:   "pending",
  IN_PROGRESS:        "in_progress",
  IN_REVIEW:          "in_progress",
  REVISION_REQUESTED: "pending",
  COMPLETED:          "completed",
  CANCELLED:          "cancelled",
}

export default async function FreelancerProjectsPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const projects = await prismaAdmin.project.findMany({
    where: { freelancerId: freelancer!.id },
    include: {
      client:     { select: { organizationName: true } },
      milestones: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = projects.filter((p) =>
    ["AWAITING_KICKOFF", "IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED", "AWAITING_APPROVAL"].includes(p.status)
  )
  const past = projects.filter((p) => ["COMPLETED", "CANCELLED", "DISPUTED"].includes(p.status))

  function ProjectRow({ project }: { project: typeof projects[0] }) {
    const total    = project.milestones.length
    const approved = project.milestones.filter((m) => m.status === "APPROVED").length

    return (
      <ListRow
        href={`/app/freelancer/projects/${project.id}`}
        title={project.title}
        subtitle={
          <div className="flex items-center gap-3">
            <span className="truncate">{project.client.organizationName}</span>
            {total > 0 && <ProgressBar value={approved} max={total} size="sm" className="w-28 flex-shrink-0" />}
          </div>
        }
      >
        <RowAmount>{formatEur(project.freelancerPriceCents)}</RowAmount>
        <StatusBadge
          variant={STATUS_VARIANT[project.status] ?? "default"}
          label={STATUS_LABEL[project.status] ?? project.status}
          dot={false}
        />
      </ListRow>
    )
  }

  return (
    <PlatformLayout variant="freelancer">
      <PageHeader title="Projects" description="Your active work, milestones and client messages." />

      {projects.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Projects appear here once an offer is accepted."
        />
      )}

      {active.length > 0 && (
        <ListSection title="Active" count={active.length}>
          {active.map((p) => <ProjectRow key={p.id} project={p} />)}
        </ListSection>
      )}

      {past.length > 0 && (
        <ListSection title="Past" count={past.length}>
          {past.map((p) => <ProjectRow key={p.id} project={p} />)}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
