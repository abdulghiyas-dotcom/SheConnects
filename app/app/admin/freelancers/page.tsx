import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Users, ArrowRight } from "lucide-react"

type StatusVariant = "active" | "cancelled" | "declined" | "default"

const STATUS_VARIANT: Record<string, StatusVariant> = {
  ACTIVE:   "active",
  ON_BREAK: "cancelled",
  REJECTED: "declined",
  REMOVED:  "cancelled",
}

const TRACK_LABEL: Record<string, string> = {
  PROGRAMMING:     "Dev & Tech",
  CREATIVE_DESIGN: "Creative Design",
  TRANSLATION:     "Translation",
  RESEARCH_DATA:   "Research & Data",
}

export default async function AdminFreelancersPage() {
  await requireRole(["ADMIN", "TEAM"])

  const freelancers = await prismaAdmin.freelancer.findMany({
    include: {
      user:   { select: { email: true } },
      _count: { select: { projects: true, receivedOffers: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = freelancers.filter((f) => f.status === "ACTIVE")
  const other  = freelancers.filter((f) =>
    f.status !== "ACTIVE" && !["APPLIED","SCREENING","INTERVIEW","TRAINING"].includes(f.status)
  )

  function Row({ f }: { f: typeof freelancers[0] }) {
    return (
      <Link
        href={`/app/admin/applications/${f.id}`}
        className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm text-slate-800">{f.alias ?? "—"}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {f.user.email} · {TRACK_LABEL[f.track] ?? f.track.replace(/_/g," ")}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-slate-400 hidden sm:block">{f._count.projects} projects</span>
          <StatusBadge
            variant={STATUS_VARIANT[f.status] ?? "default"}
            label={f.status.charAt(0) + f.status.slice(1).toLowerCase()}
            dot={false}
          />
          <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <PlatformLayout variant="admin" title="Freelancers">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Freelancers</h1>
          <p className="mt-1 text-sm text-slate-500">{active.length} active</p>
        </div>

        {freelancers.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState icon={Users} title="No freelancers yet" />
          </div>
        )}

        {active.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Active ({active.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {active.map((f) => <Row key={f.id} f={f} />)}
            </div>
          </section>
        )}

        {other.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Inactive / removed ({other.length})
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
              {other.map((f) => <Row key={f.id} f={f} />)}
            </div>
          </section>
        )}
      </div>
    </PlatformLayout>
  )
}
