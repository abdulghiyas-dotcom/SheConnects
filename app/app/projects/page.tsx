import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow, RowAmount } from "@/components/ui/list"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { formatEur } from "@/lib/utils/pricing"
import { FolderOpen } from "lucide-react"

type StatusVariant = "pending" | "in_progress" | "completed" | "cancelled" | "declined" | "default"

const STATUS_LABEL: Record<string, string> = {
  AWAITING_KICKOFF:   "Awaiting kickoff",
  IN_PROGRESS:        "In progress",
  IN_REVIEW:          "In review",
  REVISION_REQUESTED: "Revision requested",
  AWAITING_APPROVAL:  "Awaiting approval",
  COMPLETED:          "Completed",
  CANCELLED:          "Cancelled",
  DISPUTED:           "Disputed",
}

const STATUS_VARIANT: Record<string, StatusVariant> = {
  AWAITING_KICKOFF:   "pending",
  IN_PROGRESS:        "in_progress",
  IN_REVIEW:          "in_progress",
  REVISION_REQUESTED: "pending",
  AWAITING_APPROVAL:  "pending",
  COMPLETED:          "completed",
  CANCELLED:          "cancelled",
  DISPUTED:           "declined",
}

export default async function ClientProjectsPage() {
  const user = await requireRole("CLIENT")

  const client = await prismaAdmin.client.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const projects = await prismaAdmin.project.findMany({
    where: { clientId: client!.id },
    include: {
      freelancer: { select: { alias: true, aliasSlug: true } },
      milestones: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = projects.filter((p) =>
    ["AWAITING_KICKOFF", "IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED", "AWAITING_APPROVAL"].includes(p.status)
  )
  const past = projects.filter((p) =>
    ["COMPLETED", "CANCELLED", "DISPUTED"].includes(p.status)
  )

  function ProjectRow({ project }: { project: typeof projects[0] }) {
    const total    = project.milestones.length
    const approved = project.milestones.filter((m) => m.status === "APPROVED").length

    return (
      <ListRow
        href={`/app/projects/${project.id}`}
        title={project.title}
        subtitle={
          <div className="flex items-center gap-3">
            <span className="truncate">{project.freelancer.alias}</span>
            {total > 0 && <ProgressBar value={approved} max={total} size="sm" className="w-28 flex-shrink-0" />}
          </div>
        }
      >
        <RowAmount>{formatEur(project.totalCents)}</RowAmount>
        <StatusBadge
          variant={STATUS_VARIANT[project.status] ?? "default"}
          label={STATUS_LABEL[project.status] ?? project.status}
          dot={false}
        />
      </ListRow>
    )
  }

  return (
    <PlatformLayout variant="client">
      <PageHeader title="Projects" description="Track milestones, approve work and message your freelancers." />

      {projects.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Projects appear here once an offer is accepted."
          action={
            <Button asChild variant="outline">
              <Link href="/app/offers">View your offers</Link>
            </Button>
          }
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
