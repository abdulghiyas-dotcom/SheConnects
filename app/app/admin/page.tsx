import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Users, ClipboardList, FolderOpen, CreditCard, ArrowRight } from "lucide-react"

export default async function AdminPage() {
  const user = await requireRole(["ADMIN", "TEAM"])

  const [applicationCount, activeFreelancers, activeClients, activeProjects] = await Promise.all([
    prismaAdmin.freelancer.count({ where: { status: { in: ["APPLIED", "SCREENING"] } } }),
    prismaAdmin.freelancer.count({ where: { status: "ACTIVE" } }),
    prismaAdmin.client.count(),
    prismaAdmin.project.count({ where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } }),
  ])

  const OPERATIONS = [
    {
      href:   "/app/admin/applications",
      icon:   ClipboardList,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Application queue",
      sub:   `${applicationCount} pending review`,
      urgent: applicationCount > 0,
    },
    {
      href:   "/app/admin/freelancers",
      icon:   Users,
      iconBg: "bg-trust-50",
      iconColor: "text-trust-600",
      label: "Freelancer roster",
      sub:   `${activeFreelancers} active`,
    },
    {
      href:   "/app/admin/projects",
      icon:   FolderOpen,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      label: "Project dashboard",
      sub:   `${activeProjects} in progress`,
    },
    {
      href:   "/app/admin/payments",
      icon:   CreditCard,
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      label: "Payments & payouts",
      sub:   "Stripe + Wise reconciliation",
    },
  ]

  return (
    <PlatformLayout variant="admin" title="Admin Panel">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin panel</h1>
          <p className="mt-1 text-sm text-slate-500">Signed in as {user.email}</p>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={ClipboardList}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            value={applicationCount}
            label="Pending applications"
            description={applicationCount > 0 ? "Needs review" : "Queue is clear"}
          />
          <StatCard
            icon={Users}
            iconBg="bg-trust-50"
            iconColor="text-trust-600"
            value={activeFreelancers}
            label="Active freelancers"
          />
          <StatCard
            icon={Users}
            iconBg="bg-brand-50"
            iconColor="text-brand-600"
            value={activeClients}
            label="Registered clients"
          />
          <StatCard
            icon={FolderOpen}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            value={activeProjects}
            label="Active projects"
          />
        </div>

        {/* Operations */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Operations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OPERATIONS.map((op) => (
              <Link
                key={op.href}
                href={op.href}
                className={`flex items-center gap-4 rounded-2xl border bg-white px-5 py-4 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 ${op.urgent ? "border-amber-200 bg-amber-50/30" : "border-slate-100"}`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${op.iconBg}`}>
                  <op.icon size={20} className={op.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{op.label}</p>
                  <p className={`text-xs truncate ${op.urgent ? "text-amber-700 font-medium" : "text-slate-400"}`}>{op.sub}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
