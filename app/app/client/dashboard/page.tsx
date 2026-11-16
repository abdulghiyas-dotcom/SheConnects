import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { ActionCard } from "@/components/ui/action-card"
import { CtaBanner } from "@/components/ui/cta-banner"
import { Eyebrow } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Inbox, FolderOpen, Sparkles, Search, ArrowRight, Heart } from "lucide-react"

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
      href: "/app/freelancers",
      icon: Search,
      tone: "indigo" as const,
      title: "Browse freelancers",
      description: "Find and send an offer",
    },
    {
      href: "/app/brief/new",
      icon: Sparkles,
      tone: "purple" as const,
      title: "AI matching",
      description: "Describe your project, we find the right person",
    },
    {
      href: "/app/offers",
      icon: Inbox,
      tone: "amber" as const,
      title: "View offers",
      description: activeOffers > 0 ? `${activeOffers} awaiting response` : "No active offers",
    },
    {
      href: "/app/projects",
      icon: FolderOpen,
      tone: "emerald" as const,
      title: "View projects",
      description: activeProjects > 0 ? `${activeProjects} in progress` : "No active projects",
    },
  ]

  return (
    <PlatformLayout variant="client">
      <PageHeader
        title={`Welcome back, ${client.organizationName}`}
        description={
          activeOffers > 0 || activeProjects > 0
            ? `You have ${[activeOffers && `${activeOffers} active offer${activeOffers > 1 ? "s" : ""}`, activeProjects && `${activeProjects} project${activeProjects > 1 ? "s" : ""} in progress`].filter(Boolean).join(" and ")}.`
            : "Start a new project or browse the freelancer directory."
        }
        actions={
          <Button asChild>
            <Link href="/app/freelancers">
              Browse freelancers <ArrowRight size={14} />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Inbox}
          tone="indigo"
          value={activeOffers}
          label="Active offers"
          description={activeOffers === 0 ? "Send your first offer" : "Awaiting responses"}
        />
        <StatCard
          icon={FolderOpen}
          tone="emerald"
          value={activeProjects}
          label="Active projects"
          description={activeProjects === 0 ? "Projects appear here once an offer is accepted" : "Currently in progress"}
        />
        <StatCard
          icon={Heart}
          tone="amber"
          value={client.freelancersEngaged}
          label="Women supported"
          description={`€${totalSpentEur.toLocaleString("en-EU", { minimumFractionDigits: 0 })} total invested`}
        />
      </div>

      <section>
        <Eyebrow className="mb-3">Quick actions</Eyebrow>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => (
            <ActionCard key={action.href} {...action} />
          ))}
        </div>
      </section>

      {/* Impact note — only shown before first engagement */}
      {client.freelancersEngaged === 0 && (
        <CtaBanner
          title="Ready to make an impact?"
          description="Browse verified Afghan women professionals and send your first offer. Every project creates real income for someone who needs it."
          href="/app/freelancers"
          cta="Browse freelancers"
        />
      )}
    </PlatformLayout>
  )
}
