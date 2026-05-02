import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { formatEur } from "@/lib/utils/pricing"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

const STATUS_CLASS: Record<string, string> = {
  AWAITING_KICKOFF:   "bg-amber-50 text-amber-700",
  IN_PROGRESS:        "bg-brand-50 text-brand-700",
  IN_REVIEW:          "bg-brand-50 text-brand-700",
  REVISION_REQUESTED: "bg-amber-50 text-amber-700",
  COMPLETED:          "bg-trust-50 text-trust-700",
  CANCELLED:          "bg-secondary text-muted-foreground",
  DISPUTED:           "bg-red-50 text-red-600",
}

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const projects = await prismaAdmin.project.findMany({
    include: {
      client: { select: { organizationName: true } },
      freelancer: { select: { alias: true } },
      milestones: { select: { status: true } },
      payment: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = projects.filter((p) =>
    ["AWAITING_KICKOFF", "IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED", "AWAITING_APPROVAL"].includes(p.status)
  )
  const past = projects.filter((p) => ["COMPLETED", "CANCELLED", "DISPUTED"].includes(p.status))

  function Row({ p }: { p: typeof projects[0] }) {
    const approved = p.milestones.filter((m) => m.status === "APPROVED").length
    const total    = p.milestones.length
    return (
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{p.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {p.client.organizationName} → {p.freelancer.alias ?? "—"} · {approved}/{total} milestones
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm text-muted-foreground">{formatEur(p.totalCents)}</span>
          {p.payment && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              p.payment.status === "SUCCEEDED" ? "bg-trust-50 text-trust-700" :
              p.payment.status === "FAILED"    ? "bg-red-50 text-red-600" :
              "bg-amber-50 text-amber-700"
            )}>
              {p.payment.status === "SUCCEEDED" ? "Paid" : p.payment.status === "FAILED" ? "Payment failed" : "Unpaid"}
            </span>
          )}
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_CLASS[p.status] ?? "bg-secondary text-muted-foreground")}>
            {p.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="projects" />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>

        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active ({active.length})</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {active.map((p) => <Row key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past ({past.length})</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {past.map((p) => <Row key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {projects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
      </main>
    </div>
  )
}
