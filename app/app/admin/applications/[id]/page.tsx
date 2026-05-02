import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { StatusForm } from "./status-form"
import { cn } from "@/lib/utils/cn"

const STATUS_CLASS: Record<string, string> = {
  APPLIED:   "bg-amber-50 text-amber-700",
  SCREENING: "bg-brand-50 text-brand-700",
  INTERVIEW: "bg-brand-50 text-brand-700",
  TRAINING:  "bg-trust-50 text-trust-700",
  ACTIVE:    "bg-trust-50 text-trust-700",
  REJECTED:  "bg-red-50 text-red-600",
}

export default async function AdminApplicationDetailPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN", "TEAM"])

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { email: true, createdAt: true } },
      languages: true,
      skills: { include: { skill: true } },
      portfolioItems: { include: { files: { include: { file: true } } } },
    },
  })

  if (!freelancer) notFound()

  const voiceIntroFileId = (freelancer.applicationData as { voiceIntroFileId?: string } | null)?.voiceIntroFileId

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="applications" />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <Link href="/app/admin/applications" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> All applications
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {/* Main info */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-semibold">
                    {freelancer.displayCity ? `${freelancer.displayCity}, ` : ""}{freelancer.displayCountry ?? "Unknown location"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{freelancer.user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track: <span className="font-medium">{freelancer.track.replace(/_/g, " ")}</span>
                  </p>
                </div>
                <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium shrink-0", STATUS_CLASS[freelancer.status] ?? "bg-secondary text-muted-foreground")}>
                  {freelancer.status}
                </span>
              </div>

              {freelancer.tagline && (
                <p className="text-sm font-medium text-foreground mb-2">{freelancer.tagline}</p>
              )}
              {freelancer.bio && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">{freelancer.bio}</p>
              )}
            </div>

            {freelancer.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((s) => (
                    <span key={s.skillId} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full">
                      {s.skill.name} · {s.level.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {freelancer.languages.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-3">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {freelancer.languages.map((l) => (
                    <span key={l.language} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-full">
                      {l.language} · {l.proficiency.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {freelancer.portfolioItems.length > 0 && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-3">Portfolio</h2>
                <div className="space-y-3">
                  {freelancer.portfolioItems.map((item) => (
                    <div key={item.id} className="text-sm">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{item.description.slice(0, 150)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {voiceIntroFileId && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-2">Voice intro</h2>
                <p className="text-xs text-muted-foreground">File ID: {voiceIntroFileId}</p>
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold mb-3">Update status</h2>
              <StatusForm freelancerId={freelancer.id} currentStatus={freelancer.status} />
            </div>

            <div className="bg-white rounded-xl border border-border p-5 text-xs text-muted-foreground space-y-1">
              <p>Applied: {new Date(freelancer.appliedAt).toLocaleDateString("en-GB")}</p>
              {freelancer.screenedAt && <p>Screened: {new Date(freelancer.screenedAt).toLocaleDateString("en-GB")}</p>}
              {freelancer.acceptedAt && <p>Accepted: {new Date(freelancer.acceptedAt).toLocaleDateString("en-GB")}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
