import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Users, FolderOpen, Sparkles, Search, ArrowRight, Heart } from "lucide-react"

export default async function ClientDashboardPage() {
  const user = await requireRole("CLIENT")

  const client = await prismaPublic.client.findUnique({
    where: { userId: user.id },
    select: {
      organizationName: true,
      totalSpentCents: true,
      projectCount: true,
      freelancersEngaged: true,
      _count: {
        select: {
          offers:   { where: { status: { in: ["SENT", "COUNTERED", "CLIENT_REVIEWING"] } } },
          projects: { where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } },
        },
      },
    },
  })

  if (!client) redirect("/app/sign-in")

  const activeOffers   = client._count.offers
  const activeProjects = client._count.projects
  const totalSpentEur  = Number(client.totalSpentCents) / 100

  const QUICK_ACTIONS = [
    {
      href:  "/app/freelancers",
      icon:  Search,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Browse freelancers",
      sub:   "Find and send an offer",
    },
    {
      href:  "/app/brief/new",
      icon:  Sparkles,
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      label: "AI matching",
      sub:   "Describe your project, we find the right person",
    },
    {
      href:  "/app/offers",
      icon:  FolderOpen,
      iconBg: "bg-trust-50",
      iconColor: "text-trust-600",
      label: "View offers",
      sub:   activeOffers > 0 ? `${activeOffers} awaiting response` : "No active offers",
    },
    {
      href:  "/app/projects",
      icon:  Users,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      label: "View projects",
      sub:   activeProjects > 0 ? `${activeProjects} in progress` : "No active projects",
    },
  ]

  return (
    <PlatformLayout variant="client" title="Dashboard">
      <div className="workspace-page">

        {/* Welcome banner */}
        <div className="workspace-hero flex items-center justify-between gap-6">
          <div>
            <p className="workspace-eyebrow">CLIENT WORKSPACE</p>
            <h1 className="workspace-title">
              Welcome back, {client.organizationName}
            </h1>
            <p className="workspace-description">
              {activeOffers > 0 || activeProjects > 0
                ? `You have ${[activeOffers && `${activeOffers} active offer${activeOffers > 1 ? "s" : ""}`, activeProjects && `${activeProjects} project${activeProjects > 1 ? "s" : ""} in progress`].filter(Boolean).join(" and ")}.`
                : "Start a new project or browse the freelancer directory."}
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 hidden sm:flex">
            <Link href="/app/freelancers">
              Browse freelancers <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={FolderOpen}
            iconBg="bg-brand-50"
            iconColor="text-brand-600"
            value={activeOffers}
            label="Active offers"
            description={activeOffers === 0 ? "Send your first offer" : "Awaiting responses"}
          />
          <StatCard
            icon={Users}
            iconBg="bg-trust-50"
            iconColor="text-trust-600"
            value={activeProjects}
            label="Active projects"
            description={activeProjects === 0 ? "Projects appear here once an offer is accepted" : "Currently in progress"}
          />
          <StatCard
            icon={Heart}
            iconBg="bg-accent-50"
            iconColor="text-accent-600"
            value={client.freelancersEngaged}
            label="Women supported"
            description={`€${totalSpentEur.toLocaleString("en-EU", { minimumFractionDigits: 0 })} total invested`}
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="workspace-section-title">Start something meaningful</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="workspace-action"
              >
                <div className={`workspace-action-icon ${action.iconBg}`}>
                  <action.icon size={20} className={action.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#263d32]">{action.label}</p>
                  <p className="text-xs text-[#78877d] truncate">{action.sub}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-brand-600 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Impact note — only shown before first engagement */}
        {client.freelancersEngaged === 0 && (
          <div className="workspace-note">
            <h3 className="font-semibold text-brand-900">Ready to make an impact?</h3>
            <p className="mt-1 text-sm text-brand-700">
              Browse verified Afghan women professionals and send your first offer. Every project creates real income for someone who needs it.
            </p>
            <Button asChild size="sm" className="mt-4 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand">
              <Link href="/app/freelancers">Browse freelancers</Link>
            </Button>
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
