import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

const STATUS_CLASS: Record<string, string> = {
  ACTIVE:    "bg-trust-50 text-trust-700",
  ON_BREAK:  "bg-secondary text-muted-foreground",
  TRAINING:  "bg-brand-50 text-brand-700",
  REJECTED:  "bg-red-50 text-red-600",
  REMOVED:   "bg-secondary text-muted-foreground",
}

export default async function AdminFreelancersPage() {
  await requireRole(["ADMIN", "TEAM"])

  const freelancers = await prismaAdmin.freelancer.findMany({
    include: {
      user: { select: { email: true } },
      _count: { select: { projects: true, receivedOffers: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = freelancers.filter((f) => f.status === "ACTIVE")
  const other  = freelancers.filter((f) => f.status !== "ACTIVE" && !["APPLIED","SCREENING","INTERVIEW","TRAINING"].includes(f.status))

  function Row({ f }: { f: typeof freelancers[0] }) {
    return (
      <Link
        href={`/app/admin/applications/${f.id}`}
        className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-medium text-sm">{f.alias ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{f.user.email} · {f.track.replace(/_/g," ")}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
          <span>{f._count.projects} projects</span>
          <span className={cn("px-2 py-0.5 rounded-full font-medium", STATUS_CLASS[f.status] ?? "bg-secondary text-muted-foreground")}>
            {f.status}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="freelancers" />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Freelancers</h1>

        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active ({active.length})</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {active.map((f) => <Row key={f.id} f={f} />)}
            </div>
          </section>
        )}

        {other.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Inactive / removed</h2>
            <div className="bg-white rounded-xl border border-border divide-y divide-border">
              {other.map((f) => <Row key={f.id} f={f} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
