import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow } from "@/components/ui/list"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { trackLabel } from "@/components/features/track"
import { ClipboardList } from "lucide-react"

type StatusVariant = "applied" | "screening" | "interview" | "training"

const STATUS_ORDER  = ["APPLIED", "SCREENING", "INTERVIEW", "TRAINING"] as const
const STATUS_LABEL: Record<string, string> = {
  APPLIED:   "Applied — needs screening",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  TRAINING:  "Training",
}
const STATUS_VARIANT: Record<string, StatusVariant> = {
  APPLIED:   "applied",
  SCREENING: "screening",
  INTERVIEW: "interview",
  TRAINING:  "training",
}

export default async function AdminApplicationsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const applications = await prismaAdmin.freelancer.findMany({
    where: { status: { in: ["APPLIED", "SCREENING", "INTERVIEW", "TRAINING"] } },
    include: {
      user:      { select: { email: true, createdAt: true } },
      languages: { select: { language: true, proficiency: true } },
      skills:    { include: { skill: { select: { name: true } } }, take: 5 },
    },
    orderBy: { appliedAt: "asc" },
  })

  const byStatus = STATUS_ORDER.reduce<Record<string, typeof applications>>((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s)
    return acc
  }, {} as Record<string, typeof applications>)

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Applications" description={`${applications.length} pending review`} />

      {applications.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Queue is clear"
          description="No pending applications at the moment."
        />
      )}

      {STATUS_ORDER.filter((s) => byStatus[s].length > 0).map((status) => (
        <ListSection
          key={status}
          title={STATUS_LABEL[status]}
          count={byStatus[status].length}
          attention={status === "APPLIED"}
        >
          {byStatus[status].map((app) => (
            <ListRow
              key={app.id}
              href={`/app/admin/applications/${app.id}`}
              title={`${app.displayCity ? `${app.displayCity}, ` : ""}${app.displayCountry ?? "Location not set"}`}
              subtitle={
                <>
                  <p className="truncate">
                    {trackLabel(app.track)}
                    {app.skills.length > 0 && ` · ${app.skills.map((s) => s.skill.name).join(", ")}`}
                  </p>
                  <p className="mt-0.5 text-slate-400">{app.user.email}</p>
                </>
              }
            >
              <span className="hidden text-xs tabular-nums text-slate-400 sm:block">
                {new Date(app.appliedAt).toLocaleDateString("en-GB")}
              </span>
              <StatusBadge
                variant={STATUS_VARIANT[app.status]}
                label={app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                dot={false}
              />
            </ListRow>
          ))}
        </ListSection>
      ))}
    </PlatformLayout>
  )
}
