import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { MilestoneCard } from "@/components/features/milestone-card"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Callout } from "@/components/ui/callout"
import { Button } from "@/components/ui/button"
import { MilestoneActions } from "./milestone-actions"
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
  SUBMITTED:          "Awaiting review",
  APPROVED:           "Approved",
  REVISION_REQUESTED: "Revision requested",
}

export default async function ClientProjectDetailPage({ params }: { params: { id: string } }) {
  const user = await requireRole("CLIENT")

  const client = await prismaAdmin.client.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  const project = await prismaAdmin.project.findUnique({
    where: { id: params.id, clientId: client!.id },
    include: {
      freelancer: { select: { alias: true, aliasSlug: true } },
      milestones: { orderBy: { orderIndex: "asc" } },
      offer:      { select: { id: true } },
      payment:    { select: { status: true, totalCents: true } },
    },
  })

  if (!project) notFound()

  const statusLabel = project.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  const approved = project.milestones.filter((m) => m.status === "APPROVED").length
  const total    = project.milestones.length

  const paymentFailed = project.payment?.status === "FAILED"

  return (
    <PlatformLayout variant="client">
      <PageHeader
        back={{ href: "/app/projects", label: "All projects" }}
        title={project.title}
        badge={<StatusBadge variant={PROJECT_VARIANT[project.status] ?? "default"} label={statusLabel} />}
        description={
          <>
            with{" "}
            <Link href={`/app/freelancers/${project.freelancer.aliasSlug}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {project.freelancer.alias}
            </Link>
          </>
        }
      />

      {/* Payment banner */}
      {project.payment && project.payment.status !== "SUCCEEDED" && (
        <Callout
          tone={paymentFailed ? "red" : "amber"}
          icon={paymentFailed ? AlertCircle : Clock}
          title={
            paymentFailed
              ? "Payment failed — please try again."
              : `Payment of ${formatEur(project.payment.totalCents)} is due.`
          }
          action={
            <Button asChild>
              <Link href={`/app/projects/${project.id}/pay`}>
                Pay now <ArrowRight size={14} />
              </Link>
            </Button>
          }
        >
          Work begins once payment is confirmed.
        </Callout>
      )}

      {project.payment?.status === "SUCCEEDED" && (
        <Callout tone="emerald" icon={CheckCircle2} title="Payment received — thank you." />
      )}

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
                    <MilestoneActions
                      projectId={project.id}
                      milestoneId={m.id}
                      milestoneStatus={m.status}
                    />
                  }
                >
                  {m.dueAt && (
                    <p>Due {new Date(m.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</p>
                  )}
                  {m.submittedAt && m.status === "SUBMITTED" && (
                    <p>Submitted {new Date(m.submittedAt).toLocaleDateString("en-GB")}</p>
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
            <Eyebrow className="mb-4">Budget</Eyebrow>
            <PriceRows
              rows={[
                { label: "Freelancer fee", cents: project.freelancerPriceCents },
                { label: "Platform fee", cents: project.commissionCents },
                ...(project.vatCents > 0 ? [{ label: "VAT", cents: project.vatCents }] : []),
              ]}
              total={{ label: "Total", cents: project.totalCents }}
            />
            <Link
              href={`/app/offers/${project.offer.id}`}
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
