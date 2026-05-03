import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { StatusBadge } from "@/components/ui/status-badge"
import { StatusForm } from "./status-form"

type StatusVariant = "applied" | "screening" | "interview" | "training" | "active" | "declined" | "default"

const STATUS_VARIANT: Record<string, StatusVariant> = {
  APPLIED:   "applied",
  SCREENING: "screening",
  INTERVIEW: "interview",
  TRAINING:  "training",
  ACTIVE:    "active",
  REJECTED:  "declined",
}

const TRACK_LABEL: Record<string, string> = {
  PROGRAMMING:     "Dev & Tech",
  CREATIVE_DESIGN: "Creative Design",
  TRANSLATION:     "Translation",
  RESEARCH_DATA:   "Research & Data",
}

export default async function AdminApplicationDetailPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN", "TEAM"])

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { id: params.id },
    include: {
      user:           { select: { email: true, createdAt: true } },
      languages:      true,
      skills:         { include: { skill: true } },
      portfolioItems: { include: { files: { include: { file: true } } } },
    },
  })

  if (!freelancer) notFound()

  const voiceIntroFileId = (freelancer.applicationData as { voiceIntroFileId?: string } | null)?.voiceIntroFileId

  return (
    <PlatformLayout variant="admin" title="Application Review">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link href="/app/admin/applications" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft size={14} /> All applications
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-4">

            {/* Profile */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {freelancer.displayCity ? `${freelancer.displayCity}, ` : ""}{freelancer.displayCountry ?? "Unknown location"}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">{freelancer.user.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track: <span className="font-semibold text-slate-600">{TRACK_LABEL[freelancer.track] ?? freelancer.track.replace(/_/g, " ")}</span>
                  </p>
                </div>
                <StatusBadge
                  variant={STATUS_VARIANT[freelancer.status] ?? "default"}
                  label={freelancer.status.charAt(0) + freelancer.status.slice(1).toLowerCase()}
                />
              </div>

              {freelancer.tagline && (
                <p className="text-sm font-semibold text-slate-700 mb-2">{freelancer.tagline}</p>
              )}
              {freelancer.bio && (
                <p className="text-sm text-slate-500 whitespace-pre-line">{freelancer.bio}</p>
              )}
            </div>

            {/* Skills */}
            {freelancer.skills.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((s) => (
                    <span key={s.skillId} className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                      {s.skill.name} · {s.level.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {freelancer.languages.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {freelancer.languages.map((l) => (
                    <span key={l.language} className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                      {l.language} · {l.proficiency.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {freelancer.portfolioItems.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Portfolio</h2>
                <div className="space-y-3">
                  {freelancer.portfolioItems.map((item) => (
                    <div key={item.id} className="border-l-2 border-brand-200 pl-3">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description.slice(0, 150)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {voiceIntroFileId && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Voice intro</h2>
                <p className="text-xs text-slate-400">File ID: {voiceIntroFileId}</p>
              </div>
            )}
          </div>

          {/* Sidebar — actions */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Update status</h2>
              <StatusForm freelancerId={freelancer.id} currentStatus={freelancer.status} />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5 space-y-1.5 text-xs text-slate-400">
              <p>Applied: <span className="text-slate-600 font-medium">{new Date(freelancer.appliedAt).toLocaleDateString("en-GB")}</span></p>
              {freelancer.screenedAt && <p>Screened: <span className="text-slate-600 font-medium">{new Date(freelancer.screenedAt).toLocaleDateString("en-GB")}</span></p>}
              {freelancer.acceptedAt && <p>Accepted: <span className="text-slate-600 font-medium">{new Date(freelancer.acceptedAt).toLocaleDateString("en-GB")}</span></p>}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
