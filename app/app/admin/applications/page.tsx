import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { cn } from "@/lib/utils/cn"

const STATUS_ORDER = ["APPLIED", "SCREENING", "INTERVIEW", "TRAINING"]

const STATUS_CLASS: Record<string, string> = {
  APPLIED:   "bg-amber-50 text-amber-700",
  SCREENING: "bg-brand-50 text-brand-700",
  INTERVIEW: "bg-brand-50 text-brand-700",
  TRAINING:  "bg-trust-50 text-trust-700",
}

export default async function AdminApplicationsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const applications = await prismaAdmin.freelancer.findMany({
    where: { status: { in: ["APPLIED", "SCREENING", "INTERVIEW", "TRAINING"] } },
    include: {
      user: { select: { email: true, createdAt: true } },
      languages: { select: { language: true, proficiency: true } },
      skills: { include: { skill: { select: { name: true } } }, take: 5 },
    },
    orderBy: { appliedAt: "asc" },
  })

  const byStatus = STATUS_ORDER.reduce<Record<string, typeof applications>>((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s)
    return acc
  }, {})

  const STATUS_LABEL: Record<string, string> = {
    APPLIED: "Applied — needs screening",
    SCREENING: "Screening",
    INTERVIEW: "Interview",
    TRAINING: "Training",
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="applications" />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">{applications.length} pending</p>
        </div>

        {applications.length === 0 && (
          <p className="text-muted-foreground">No pending applications.</p>
        )}

        {STATUS_ORDER.filter((s) => byStatus[s].length > 0).map((status) => (
          <section key={status}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {STATUS_LABEL[status]} ({byStatus[status].length})
            </h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {byStatus[status].map((app) => (
                <Link
                  key={app.id}
                  href={`/app/admin/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {app.displayCity ? `${app.displayCity}, ` : ""}{app.displayCountry ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {app.track.replace(/_/g, " ")} · {app.skills.map((s) => s.skill.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(app.appliedAt).toLocaleDateString("en-GB")}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_CLASS[app.status])}>
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
