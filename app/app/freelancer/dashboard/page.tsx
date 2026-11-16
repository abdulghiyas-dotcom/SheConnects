import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Stepper } from "@/components/ui/stepper"
import { Card, CardTitle } from "@/components/ui/card"
import { Callout } from "@/components/ui/callout"
import { CtaBanner } from "@/components/ui/cta-banner"
import { Button } from "@/components/ui/button"
import { Inbox, FolderOpen, Wallet, Info } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  APPLIED:   "Application received",
  SCREENING: "Being reviewed",
  INTERVIEW: "Interview stage",
  TRAINING:  "Onboarding",
  ACTIVE:    "Active — you're live!",
  ON_BREAK:  "On break",
  REJECTED:  "Application not successful",
}

const STATUS_STEPS = [
  { label: "Applied" },
  { label: "Screening" },
  { label: "Interview" },
  { label: "Training" },
  { label: "Active" },
]

const STATUS_VARIANT_MAP: Record<string, "applied" | "screening" | "interview" | "training" | "active" | "default"> = {
  APPLIED:   "applied",
  SCREENING: "screening",
  INTERVIEW: "interview",
  TRAINING:  "training",
  ACTIVE:    "active",
  DEFAULT:   "default",
}

const STATUS_NEXT_MESSAGE: Record<string, string> = {
  APPLIED:   "Our team reviews applications within 3–5 working days. We'll email you when your status changes.",
  SCREENING: "Your application is being reviewed. We may reach out with a few questions.",
  INTERVIEW: "You're at the interview stage. Check your email for a link to schedule a call with our team.",
  TRAINING:  "Almost there! Complete the onboarding training modules to go live on the platform.",
}

const DB_STEP_INDEX: Record<string, number> = {
  APPLIED: 0, SCREENING: 1, INTERVIEW: 2, TRAINING: 3, ACTIVE: 4,
}

export default async function FreelancerDashboardPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: {
      status: true,
      alias: true,
      track: true,
      completedProjectCount: true,
      totalEarningsCents: true,
      _count: {
        select: {
          receivedOffers: { where: { status: { in: ["SENT", "COUNTERED"] } } },
          projects:       { where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } },
        },
      },
    },
  })

  if (!freelancer) redirect("/app/sign-in")

  const currentStepIndex = DB_STEP_INDEX[freelancer.status] ?? 0
  const activeOffers     = freelancer._count.receivedOffers
  const activeProjects   = freelancer._count.projects
  const totalEarned      = Number(freelancer.totalEarningsCents) / 100
  const isActive         = freelancer.status === "ACTIVE"
  const trackLabel       = freelancer.track?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) ?? ""
  const statusVariant    = STATUS_VARIANT_MAP[freelancer.status] ?? "default"

  return (
    <PlatformLayout variant="freelancer">
      <PageHeader
        title={freelancer.alias ? `Welcome, ${freelancer.alias}` : "Welcome"}
        badge={
          <StatusBadge
            variant={statusVariant}
            label={STATUS_LABELS[freelancer.status] ?? freelancer.status}
          />
        }
        description={`${trackLabel} track`}
        actions={
          isActive && (
            <Button asChild variant="outline" size="sm">
              <Link href="/app/freelancer/alias">Change alias</Link>
            </Button>
          )
        }
      />

      {/* Application progress — until ACTIVE */}
      {!isActive && freelancer.status !== "REJECTED" && (
        <Card className="space-y-6 p-6 sm:p-8">
          <CardTitle>Your application progress</CardTitle>
          <Stepper steps={STATUS_STEPS} currentStep={currentStepIndex} />
        </Card>
      )}

      {/* Stats — only when ACTIVE */}
      {isActive && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Inbox}
            tone="amber"
            value={activeOffers}
            label="Pending offers"
            description={activeOffers > 0 ? "Awaiting your response" : "No new offers yet"}
          />
          <StatCard
            icon={FolderOpen}
            tone="indigo"
            value={activeProjects}
            label="Active projects"
            description={activeProjects > 0 ? "Currently in progress" : "No active projects"}
          />
          <StatCard
            icon={Wallet}
            tone="emerald"
            value={`€${totalEarned.toFixed(0)}`}
            label="Total earned"
            description={`${freelancer.completedProjectCount} project${freelancer.completedProjectCount !== 1 ? "s" : ""} completed`}
          />
        </div>
      )}

      {/* CTA when active & has offers */}
      {isActive && activeOffers > 0 && (
        <CtaBanner
          title={`You have ${activeOffers} new offer${activeOffers > 1 ? "s" : ""}`}
          description="Review and respond to keep clients engaged."
          href="/app/freelancer/offers"
          cta="View offers"
        />
      )}

      {/* What happens next — non-active states */}
      {!isActive && (
        <Callout tone="indigo" icon={Info} title="What happens next?">
          {STATUS_NEXT_MESSAGE[freelancer.status] ?? "Keep an eye on your email — we'll be in touch soon."}
        </Callout>
      )}
    </PlatformLayout>
  )
}
