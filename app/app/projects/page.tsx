import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { ClientNav } from "@/components/features/client-nav"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"

const STATUS_LABEL: Record<string, string> = {
  AWAITING_KICKOFF:  "Awaiting kickoff",
  IN_PROGRESS:       "In progress",
  IN_REVIEW:         "In review",
  REVISION_REQUESTED:"Revision requested",
  AWAITING_APPROVAL: "Awaiting approval",
  COMPLETED:         "Completed",
  CANCELLED:         "Cancelled",
  DISPUTED:          "Disputed",
}

const STATUS_CLASS: Record<string, string> = {
  AWAITING_KICKOFF:   "bg-amber-50 text-amber-700",
  IN_PROGRESS:        "bg-brand-50 text-brand-700",
  IN_REVIEW:          "bg-brand-50 text-brand-700",
  REVISION_REQUESTED: "bg-amber-50 text-amber-700",
  AWAITING_APPROVAL:  "bg-amber-50 text-amber-700",
  COMPLETED:          "bg-trust-50 text-trust-700",
  CANCELLED:          "bg-secondary text-muted-foreground",
  DISPUTED:           "bg-red-50 text-red-600",
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
    const total = project.milestones.length
    const approved = project.milestones.filter((m) => m.status === "APPROVED").length
    return (
      <Link
        href={`/app/projects/${project.id}`}
        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-secondary/40 rounded-lg transition-colors"
      >
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{project.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {project.freelancer.alias} · {approved}/{total} milestones
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-muted-foreground">{formatEur(project.totalCents)}</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            STATUS_CLASS[project.status] ?? "bg-secondary text-muted-foreground"
          )}>
            {STATUS_LABEL[project.status] ?? project.status}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="projects" />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>

        {projects.length === 0 && (
          <p className="text-muted-foreground">No projects yet — they appear here once an offer is accepted.</p>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {active.map((p) => <ProjectRow key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {past.map((p) => <ProjectRow key={p.id} project={p} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
