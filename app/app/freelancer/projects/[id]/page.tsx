import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { FreelancerNav } from "@/components/features/freelancer-nav"
import { MilestoneSubmitForm } from "./submit-form"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"

const PROJECT_STATUS_CLASS: Record<string, string> = {
  AWAITING_KICKOFF:   "bg-amber-50 text-amber-700",
  IN_PROGRESS:        "bg-brand-50 text-brand-700",
  COMPLETED:          "bg-trust-50 text-trust-700",
  CANCELLED:          "bg-secondary text-muted-foreground",
}

const MILESTONE_STATUS_LABEL: Record<string, string> = {
  PENDING:            "Not started",
  IN_PROGRESS:        "In progress",
  SUBMITTED:          "Submitted — awaiting client",
  APPROVED:           "Approved",
  REVISION_REQUESTED: "Revision requested",
}

const MILESTONE_STATUS_CLASS: Record<string, string> = {
  PENDING:            "bg-secondary text-muted-foreground",
  IN_PROGRESS:        "bg-brand-50 text-brand-700",
  SUBMITTED:          "bg-amber-50 text-amber-700",
  APPROVED:           "bg-trust-50 text-trust-700",
  REVISION_REQUESTED: "bg-red-50 text-red-600",
}

export default async function FreelancerProjectDetailPage({ params }: { params: { id: string } }) {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const project = await prismaAdmin.project.findUnique({
    where: { id: params.id, freelancerId: freelancer!.id },
    include: {
      client: { select: { organizationName: true } },
      milestones: { orderBy: { orderIndex: "asc" } },
      offer: { select: { id: true } },
    },
  })

  if (!project) notFound()

  const statusLabel = project.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="min-h-screen bg-secondary/30">
      <FreelancerNav active="projects" />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Link href="/app/freelancer/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> All projects
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-xl font-semibold">{project.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{project.client.organizationName}</p>
            </div>
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium shrink-0",
              PROJECT_STATUS_CLASS[project.status] ?? "bg-secondary text-muted-foreground"
            )}>
              {statusLabel}
            </span>
          </div>

          <p className="text-sm text-foreground whitespace-pre-line mt-3">{project.description}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground border-t border-border pt-4 mt-4">
            <span>Your earnings</span><span>{formatEur(project.freelancerPriceCents)}</span>
            <span>Platform fee</span><span>{formatEur(project.commissionCents)}</span>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            <Link href={`/app/freelancer/offers/${project.offer.id}`} className="hover:underline">View original offer →</Link>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Milestones</h2>
          <div className="space-y-3">
            {project.milestones.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{m.description}</p>
                    )}
                    {m.dueAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due {new Date(m.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                      </p>
                    )}
                    {m.status === "REVISION_REQUESTED" && (
                      <p className="text-xs text-amber-700 mt-1 font-medium">The client has requested a revision.</p>
                    )}
                    {m.approvedAt && (
                      <p className="text-xs text-trust-700 mt-1">
                        Approved {new Date(m.approvedAt).toLocaleDateString("en-GB")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      MILESTONE_STATUS_CLASS[m.status] ?? "bg-secondary text-muted-foreground"
                    )}>
                      {MILESTONE_STATUS_LABEL[m.status] ?? m.status}
                    </span>
                    <MilestoneSubmitForm
                      projectId={project.id}
                      milestoneId={m.id}
                      milestoneStatus={m.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
