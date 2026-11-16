import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { MilestoneCard } from "@/components/features/milestone-card"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { ProgressBar } from "@/components/ui/progress-bar"
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
    <PlatformLayout variant="freelancer">
      <PageHeader
        back={{ href: "/app/freelancer/projects", label: "All projects" }}
        title={project.title}
        badge={<StatusBadge variant={PROJECT_VARIANT[project.status] ?? "default"} label={statusLabel} />}
        description={project.client.organizationName}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card className="p-6">
            <Eyebrow className="mb-3">Brief</Eyebrow>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{project.description}</p>
          </Card>

          <section>
            <Eyebrow className="mb-3">Milestones</Eyebrow>
            <div className="space-y-3">
              {project.milestones.map((m, idx) => (
                <MilestoneCard
                  key={m.id}
                  index={idx}
                  title={m.title}
                  description={m.description}
                  statusVariant={MILESTONE_VARIANT[m.status] ?? "default"}
                  statusLabel={MILESTONE_LABEL[m.status] ?? m.status}
                  action={
                    <MilestoneSubmitForm
                      projectId={project.id}
                      milestoneId={m.id}
                      milestoneStatus={m.status}
                    />
                  }
                >
                  {m.dueAt && (
                    <p>Due {new Date(m.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</p>
                  )}
                  {m.status === "REVISION_REQUESTED" && (
                    <p className="font-semibold text-amber-700">The client has requested a revision.</p>
                  )}
                  {m.approvedAt && (
                    <p className="font-semibold text-emerald-600">
                      Approved {new Date(m.approvedAt).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </MilestoneCard>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow className="mb-3">Messages</Eyebrow>
            <Card className="p-6">
              <MessageThread projectId={project.id} />
              <div className="mt-4 border-t border-slate-100 pt-4">
                <MessageInput projectId={project.id} />
              </div>
            </Card>
          </section>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {total > 0 && (
            <Card className="p-6">
              <Eyebrow className="mb-3">Milestone progress</Eyebrow>
              <ProgressBar value={approved} max={total} />
            </Card>
          )}

          <Card className="p-6">
            <Eyebrow className="mb-4">Earnings</Eyebrow>
            <PriceRows
              rows={[{ label: "Platform fee (paid by client)", cents: project.commissionCents }]}
              total={{ label: "Your earnings", cents: project.freelancerPriceCents }}
            />
            <Link
              href={`/app/freelancer/offers/${project.offer.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-indigo-600"
            >
              View original offer <ArrowRight size={12} />
            </Link>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  )
}
