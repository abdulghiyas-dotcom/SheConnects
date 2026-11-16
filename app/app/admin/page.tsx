import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { ActionCard } from "@/components/ui/action-card"
import { Eyebrow } from "@/components/ui/card"
import { Users, Building2, ClipboardList, FolderOpen, CreditCard } from "lucide-react"

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
      href: "/app/admin/applications",
      icon: ClipboardList,
      tone: "amber" as const,
      title: "Application queue",
      description: `${applicationCount} pending review`,
      attention: applicationCount > 0,
    },
    {
      href: "/app/admin/freelancers",
      icon: Users,
      tone: "purple" as const,
      title: "Freelancer roster",
      description: `${activeFreelancers} active`,
    },
    {
      href: "/app/admin/projects",
      icon: FolderOpen,
      tone: "indigo" as const,
      title: "Project dashboard",
      description: `${activeProjects} in progress`,
    },
    {
      href: "/app/admin/payments",
      icon: CreditCard,
      tone: "emerald" as const,
      title: "Payments & payouts",
      description: "Stripe + Wise reconciliation",
    },
  ]

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Admin panel" description={`Signed in as ${user.email}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          tone="amber"
          value={applicationCount}
          label="Pending applications"
          description={applicationCount > 0 ? "Needs review" : "Queue is clear"}
        />
        <StatCard icon={Users} tone="purple" value={activeFreelancers} label="Active freelancers" />
        <StatCard icon={Building2} tone="indigo" value={activeClients} label="Registered clients" />
        <StatCard icon={FolderOpen} tone="emerald" value={activeProjects} label="Active projects" />
      </div>

      <section>
        <Eyebrow className="mb-3">Operations</Eyebrow>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPERATIONS.map((op) => (
            <ActionCard key={op.href} {...op} />
          ))}
        </div>
      </section>
    </PlatformLayout>
  )
}
