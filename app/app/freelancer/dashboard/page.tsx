import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Application received",
  SCREENING: "Being reviewed",
  INTERVIEW: "Interview stage",
  TRAINING: "Onboarding",
  ACTIVE: "Active — you're live!",
  ON_BREAK: "On break",
  REJECTED: "Application not successful",
}

const STATUS_STEPS = ["APPLIED", "SCREENING", "INTERVIEW", "TRAINING", "ACTIVE"]

export default async function FreelancerDashboardPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: {
      status: true,
      alias: true,
      track: true,
      completedProjectCount: true,
      totalEarningsCents: true,
      _count: {
        select: {
          receivedOffers: { where: { status: { in: ["SENT", "COUNTERED"] } } },
          projects: { where: { status: { in: ["AWAITING_KICKOFF", "IN_PROGRESS"] } } },
        },
      },
    },
  })

  if (!freelancer) redirect("/app/sign-in")

  const currentStep = STATUS_STEPS.indexOf(freelancer.status)
  const activeOffers = freelancer._count.receivedOffers
  const activeProjects = freelancer._count.projects
  const totalEarned = Number(freelancer.totalEarningsCents) / 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">SheConnects</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/app/freelancer/dashboard" className="text-foreground font-medium">Dashboard</Link>
            <Link href="/app/sign-in" className="text-muted-foreground hover:text-foreground">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {freelancer.alias ? `Welcome, ${freelancer.alias}` : "Welcome"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {freelancer.track?.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())} track
            </p>
            {freelancer.status === "ACTIVE" && (
              <Link
                href="/app/freelancer/alias"
                className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline mt-1 inline-block"
              >
                Change alias
              </Link>
            )}
          </div>
          <Badge variant={freelancer.status === "ACTIVE" ? "default" : "secondary"}>
            {STATUS_LABELS[freelancer.status] ?? freelancer.status}
          </Badge>
        </div>

        {/* Application progress — shown until ACTIVE */}
        {freelancer.status !== "ACTIVE" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your application progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < currentStep
                          ? "bg-trust-500 text-white"
                          : i === currentStep
                          ? "bg-brand-500 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 text-center leading-tight max-w-16">
                        {step.charAt(0) + step.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${
                        i < currentStep ? "bg-trust-500" : "bg-secondary"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {freelancer.status === "APPLIED" && (
                <p className="text-sm text-muted-foreground mt-4">
                  Your application has been received. Our team reviews applications within 3–5 working days.
                  We&apos;ll email you when your status changes.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats — only shown when ACTIVE */}
        {freelancer.status === "ACTIVE" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending offers</CardTitle>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">€{totalEarned.toFixed(0)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next step guidance */}
        <Card className="border-brand-100 bg-brand-50/30">
          <CardContent className="p-6">
            <h3 className="font-medium">What happens next?</h3>
            {freelancer.status === "APPLIED" && (
              <p className="text-sm text-muted-foreground mt-1">
                Our team will review your application and contact you within 3–5 days. There&apos;s nothing else you need to do right now.
              </p>
            )}
            {freelancer.status === "SCREENING" && (
              <p className="text-sm text-muted-foreground mt-1">
                Your application is being reviewed. We may reach out with a few questions.
              </p>
            )}
            {freelancer.status === "INTERVIEW" && (
              <p className="text-sm text-muted-foreground mt-1">
                You&apos;re at the interview stage. Check your email for a link to schedule a call with our team.
              </p>
            )}
            {freelancer.status === "TRAINING" && (
              <p className="text-sm text-muted-foreground mt-1">
                Almost there! Complete the onboarding training modules to go live on the platform.
              </p>
            )}
            {freelancer.status === "ACTIVE" && activeOffers > 0 && (
              <>
                <p className="text-sm text-muted-foreground mt-1">
                  You have {activeOffers} new offer{activeOffers > 1 ? "s" : ""} waiting for your response.
                </p>
                <Button asChild className="mt-3" size="sm">
                  <Link href="/app/freelancer/offers">View offers</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
