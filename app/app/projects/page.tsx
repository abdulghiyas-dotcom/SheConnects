import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { formatEur } from "@/lib/utils/pricing"
import { FolderOpen, ArrowRight } from "lucide-react"

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
    const progress = total > 0 ? Math.round((approved / total) * 100) : 0

    return (
      <Link
        href={`/app/projects/${project.id}`}
        className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-slate-800 truncate">{project.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-400">{project.freelancer.alias}</p>
            {total > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-trust-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{approved}/{total}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-slate-700 tabular-nums hidden sm:block">
            {formatEur(project.totalCents)}
          </span>
          <StatusBadge
            variant={STATUS_VARIANT[project.status] ?? "default"}
            label={STATUS_LABEL[project.status] ?? project.status}
            dot={false}
          />
          <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <PlatformLayout variant="client" title="Projects">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>

        {projects.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="Projects appear here once an offer is accepted."
              action={
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/app/offers">View your offers</Link>
                </Button>
              }
            />
          </div>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Active ({active.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {active.map((p) => <ProjectRow key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Past ({past.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {past.map((p) => <ProjectRow key={p.id} project={p} />)}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
