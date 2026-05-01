import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaPublic } from "@/lib/db/prisma-public"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FolderOpen, Sparkles, Search } from "lucide-react"

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
          offers: { where: { status: { in: ["SENT", "COUNTERED", "CLIENT_REVIEWING"] } } },
          projects: { where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } },
        },
      },
    },
  })

  if (!client) redirect("/app/sign-in")

  const activeOffers = client._count.offers
  const activeProjects = client._count.projects
  const totalSpentEur = Number(client.totalSpentCents) / 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-foreground">SheConnects</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app/client/dashboard" className="text-foreground font-medium">Dashboard</Link>
            <Link href="/app/freelancers" className="text-muted-foreground hover:text-foreground">Freelancers</Link>
            <Link href="/app/offers" className="text-muted-foreground hover:text-foreground">Offers</Link>
            <Link href="/app/sign-in" className="text-muted-foreground hover:text-foreground">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {client.organizationName}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active offers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeOffers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeProjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Women supported</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{client.freelancersEngaged}</p>
              <p className="text-xs text-muted-foreground mt-1">
                €{totalSpentEur.toLocaleString("en-EU", { minimumFractionDigits: 0 })} total invested
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/app/freelancers">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-brand-50 p-2.5">
                    <Search size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Browse freelancers</p>
                    <p className="text-xs text-muted-foreground">Find and send an offer</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/find">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-accent-50 p-2.5">
                    <Sparkles size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI matching</p>
                    <p className="text-xs text-muted-foreground">Describe your project, we find the right person</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/offers">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-trust-50 p-2.5">
                    <FolderOpen size={20} className="text-trust-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">View offers</p>
                    <p className="text-xs text-muted-foreground">
                      {activeOffers > 0 ? `${activeOffers} awaiting response` : "No active offers"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/projects">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-secondary p-2.5">
                    <Users size={20} className="text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">View projects</p>
                    <p className="text-xs text-muted-foreground">
                      {activeProjects > 0 ? `${activeProjects} in progress` : "No active projects"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Impact note */}
        {client.freelancersEngaged === 0 && (
          <Card className="border-brand-100 bg-brand-50/30">
            <CardContent className="p-6">
              <h3 className="font-medium text-brand-900">Ready to make an impact?</h3>
              <p className="text-sm text-brand-700 mt-1">
                Browse verified Afghan women professionals and send your first offer. Every project creates real income for someone who needs it.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/app/freelancers">Browse freelancers</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
