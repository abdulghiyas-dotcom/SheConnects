import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { MilestoneSubmitForm } from "./submit-form"
import { MessageThread } from "@/components/features/message-thread"
import { MessageInput } from "@/components/features/message-input"
import { formatEur } from "@/lib/utils/pricing"

type StatusVariant = "pending" | "in_progress" | "completed" | "cancelled" | "declined" | "default"

const PROJECT_VARIANT: Record<string, StatusVariant> = {
  AWAITING_KICKOFF: "pending",
  IN_PROGRESS:      "in_progress",
  COMPLETED:        "completed",
  CANCELLED:        "cancelled",
}

const MILESTONE_VARIANT: Record<string, StatusVariant> = {
  PENDING:            "default",
  IN_PROGRESS:        "in_progress",
  SUBMITTED:          "pending",
  APPROVED:           "completed",
  REVISION_REQUESTED: "declined",
}

const MILESTONE_LABEL: Record<string, string> = {
  PENDING:            "Not started",
  IN_PROGRESS:        "In progress",
  SUBMITTED:          "Submitted",
  APPROVED:           "Approved",
  REVISION_REQUESTED: "Revision requested",
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
      client:     { select: { organizationName: true } },
      milestones: { orderBy: { orderIndex: "asc" } },
      offer:      { select: { id: true } },
    },
  })

  if (!project) notFound()

  const statusLabel = project.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  const approved = project.milestones.filter((m) => m.status === "APPROVED").length
  const total    = project.milestones.length

  return (
    <PlatformLayout variant="freelancer" title={project.title}>
      <div className="max-w-3xl mx-auto space-y-6">

        <Link href="/app/freelancer/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} /> All projects
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{project.client.organizationName}</p>
            </div>
            <StatusBadge variant={PROJECT_VARIANT[project.status] ?? "default"} label={statusLabel} />
          </div>

          <p className="text-sm text-slate-700 whitespace-pre-line">{project.description}</p>

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Milestone progress</span>
                <span className="text-xs font-medium text-slate-700">{approved}/{total}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-trust-500 transition-all"
                  style={{ width: `${Math.round((approved / total) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-4 mt-4">
            <span>Your earnings</span><span className="text-right tabular-nums">{formatEur(project.freelancerPriceCents)}</span>
            <span>Platform fee</span><span className="text-right tabular-nums">{formatEur(project.commissionCents)}</span>
          </div>
          <Link href={`/app/freelancer/offers/${project.offer.id}`} className="mt-3 inline-block text-xs text-slate-400 hover:text-slate-600 hover:underline">
            View original offer →
          </Link>
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Milestones</h2>
          <div className="space-y-2">
            {project.milestones.map((m, idx) => (
              <div key={m.id} className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800">{m.title}</p>
                      {m.description && (
                        <p className="text-xs text-slate-500 mt-1 whitespace-pre-line">{m.description}</p>
                      )}
                      {m.dueAt && (
                        <p className="text-xs text-slate-400 mt-1">
                          Due {new Date(m.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                        </p>
                      )}
                      {m.status === "REVISION_REQUESTED" && (
                        <p className="text-xs text-amber-700 mt-1 font-medium">The client has requested a revision.</p>
                      )}
                      {m.approvedAt && (
                        <p className="text-xs text-trust-600 mt-1 font-medium">
                          Approved {new Date(m.approvedAt).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge
                      variant={MILESTONE_VARIANT[m.status] ?? "default"}
                      label={MILESTONE_LABEL[m.status] ?? m.status}
                      dot={false}
                    />
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

        {/* Messages */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Messages</h2>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
            <MessageThread projectId={project.id} />
            <div className="mt-3">
              <MessageInput projectId={project.id} />
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
