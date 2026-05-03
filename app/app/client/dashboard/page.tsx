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
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="rounded-2xl border border-slate-100 bg-white px-7 py-6 shadow-card flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {client.organizationName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeOffers > 0 || activeProjects > 0
                ? `You have ${[activeOffers && `${activeOffers} active offer${activeOffers > 1 ? "s" : ""}`, activeProjects && `${activeProjects} project${activeProjects > 1 ? "s" : ""} in progress`].filter(Boolean).join(" and ")}.`
                : "Start a new project or browse the freelancer directory."}
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand hidden sm:flex">
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
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}>
                  <action.icon size={20} className={action.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                  <p className="text-xs text-slate-400 truncate">{action.sub}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Impact note — only shown before first engagement */}
        {client.freelancersEngaged === 0 && (
          <div className="rounded-2xl border border-brand-100 bg-brand-50/50 px-7 py-6">
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
