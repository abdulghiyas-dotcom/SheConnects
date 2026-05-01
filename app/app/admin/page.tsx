import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ClipboardList, FolderOpen, CreditCard } from "lucide-react"

export default async function AdminPage() {
  const user = await requireRole(["ADMIN", "TEAM"])

  const [applicationCount, activeFreelancers, activeClients, activeProjects] = await Promise.all([
    prismaAdmin.freelancer.count({ where: { status: { in: ["APPLIED", "SCREENING"] } } }),
    prismaAdmin.freelancer.count({ where: { status: "ACTIVE" } }),
    prismaAdmin.client.count(),
    prismaAdmin.project.count({ where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } }),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold">SheConnects</span>
            <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app/admin" className="text-foreground font-medium">Overview</Link>
            <Link href="/app/admin/applications" className="text-muted-foreground hover:text-foreground">Applications</Link>
            <Link href="/app/admin/freelancers" className="text-muted-foreground hover:text-foreground">Freelancers</Link>
            <Link href="/app/admin/clients" className="text-muted-foreground hover:text-foreground">Clients</Link>
            <Link href="/app/admin/projects" className="text-muted-foreground hover:text-foreground">Projects</Link>
            <Link href="/app/sign-in" className="text-muted-foreground hover:text-foreground">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin panel</h1>
          <p className="text-muted-foreground mt-1">Signed in as {user.email}</p>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pending applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{applicationCount}</p>
              {applicationCount > 0 && (
                <Link href="/app/admin/applications" className="text-xs text-brand-600 hover:underline mt-1 block">
                  Review now →
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Active freelancers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeFreelancers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Registered clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeClients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Active projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeProjects}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-medium mb-4">Operations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/app/admin/applications">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-brand-50 p-2.5">
                    <ClipboardList size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Application queue</p>
                    <p className="text-xs text-muted-foreground">
                      {applicationCount} pending review
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/admin/freelancers">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-trust-50 p-2.5">
                    <Users size={20} className="text-trust-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Freelancer roster</p>
                    <p className="text-xs text-muted-foreground">{activeFreelancers} active</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/admin/projects">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-secondary p-2.5">
                    <FolderOpen size={20} className="text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Project dashboard</p>
                    <p className="text-xs text-muted-foreground">{activeProjects} in progress</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/admin/payments">
              <Card className="hover:border-brand-300 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-accent-50 p-2.5">
                    <CreditCard size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Payments & payouts</p>
                    <p className="text-xs text-muted-foreground">Stripe + Wise reconciliation</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
