import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { ProgressStepper } from "@/components/ui/progress-stepper"
import { Button } from "@/components/ui/button"
import { Inbox, FolderOpen, DollarSign, ArrowRight } from "lucide-react"

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
    <PlatformLayout variant="freelancer" title="Dashboard">
      <div className="workspace-page">

        {/* Welcome banner */}
        <div className="workspace-hero flex items-start justify-between gap-6">
          <div>
            <p className="workspace-eyebrow">YOUR PROFESSIONAL SPACE</p>
            <h1 className="workspace-title">
              {freelancer.alias ? `Welcome, ${freelancer.alias}` : "Welcome"}
            </h1>
            <p className="workspace-description">{trackLabel} track</p>
            {isActive && (
              <Link
                href="/app/freelancer/alias"
                className="mt-1 inline-block text-xs text-brand-600 hover:underline"
              >
                Change alias →
              </Link>
            )}
          </div>
          <StatusBadge
            variant={statusVariant}
            label={STATUS_LABELS[freelancer.status] ?? freelancer.status}
          />
        </div>

        {/* Application progress — until ACTIVE */}
        {!isActive && freelancer.status !== "REJECTED" && (
          <div className="rounded-2xl border border-[#dfe6de] bg-[#fffefa] px-7 py-6 shadow-card space-y-5">
            <h2 className="workspace-section-title mb-0">Your application progress</h2>
            <ProgressStepper steps={STATUS_STEPS} currentStep={currentStepIndex} />
            {STATUS_NEXT_MESSAGE[freelancer.status] && (
              <p className="text-sm text-slate-500 pt-2 border-t border-slate-100">
                {STATUS_NEXT_MESSAGE[freelancer.status]}
              </p>
            )}
          </div>
        )}

        {/* Stats — only when ACTIVE */}
        {isActive && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Inbox}
              iconBg="bg-accent-50"
              iconColor="text-accent-600"
              value={activeOffers}
              label="Pending offers"
              description={activeOffers > 0 ? "Awaiting your response" : "No new offers yet"}
            />
            <StatCard
              icon={FolderOpen}
              iconBg="bg-brand-50"
              iconColor="text-brand-600"
              value={activeProjects}
              label="Active projects"
              description={activeProjects > 0 ? "Currently in progress" : "No active projects"}
            />
            <StatCard
              icon={DollarSign}
              iconBg="bg-trust-50"
              iconColor="text-trust-600"
              value={`€${totalEarned.toFixed(0)}`}
              label="Total earned"
              description={`${freelancer.completedProjectCount} project${freelancer.completedProjectCount !== 1 ? "s" : ""} completed`}
            />
          </div>
        )}

        {/* CTA card when active & has offers */}
        {isActive && activeOffers > 0 && (
          <div className="workspace-note flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-brand-900">
                You have {activeOffers} new offer{activeOffers > 1 ? "s" : ""}
              </h3>
              <p className="mt-1 text-sm text-brand-700">
                Review and respond to keep clients engaged.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand">
              <Link href="/app/freelancer/offers">
                View offers <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        )}

        {/* What happens next — non-active states */}
        {!isActive && (
          <div className="rounded-2xl border border-[#dfe6de] bg-[#fffefa] px-7 py-6 shadow-card">
            <h3 className="font-bold text-[#263d32]">What happens next?</h3>
            <p className="mt-2 text-sm text-[#637168]">
              {STATUS_NEXT_MESSAGE[freelancer.status] ?? "Keep an eye on your email — we'll be in touch soon."}
            </p>
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
