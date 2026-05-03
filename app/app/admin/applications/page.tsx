import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ClipboardList, ArrowRight } from "lucide-react"

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
    <PlatformLayout variant="admin" title="Applications">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-slate-500">{applications.length} pending review</p>
        </div>

        {applications.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState
              icon={ClipboardList}
              title="Queue is clear"
              description="No pending applications at the moment."
            />
          </div>
        )}

        {STATUS_ORDER.filter((s) => byStatus[s].length > 0).map((status) => (
          <section key={status}>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {STATUS_LABEL[status]} ({byStatus[status].length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {byStatus[status].map((app) => (
                <Link
                  key={app.id}
                  href={`/app/admin/applications/${app.id}`}
                  className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800">
                      {app.displayCity ? `${app.displayCity}, ` : ""}{app.displayCountry ?? "Location not set"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {app.track.replace(/_/g, " ")} · {app.skills.map((s) => s.skill.name).join(", ")}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{app.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {new Date(app.appliedAt).toLocaleDateString("en-GB")}
                    </span>
                    <StatusBadge
                      variant={STATUS_VARIANT[app.status]}
                      label={app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      dot={false}
                    />
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PlatformLayout>
  )
}
