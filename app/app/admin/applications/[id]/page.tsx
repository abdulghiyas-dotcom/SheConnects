import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card, Eyebrow } from "@/components/ui/card"
import { Tag } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { TrackBadge } from "@/components/features/track"
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

  const dates = [
    { label: "Applied",  value: freelancer.appliedAt },
    { label: "Screened", value: freelancer.screenedAt },
    { label: "Accepted", value: freelancer.acceptedAt },
  ].filter((d) => d.value)

  return (
    <PlatformLayout variant="admin">
      <PageHeader
        back={{ href: "/app/admin/applications", label: "All applications" }}
        title={`${freelancer.displayCity ? `${freelancer.displayCity}, ` : ""}${freelancer.displayCountry ?? "Unknown location"}`}
        badge={
          <StatusBadge
            variant={STATUS_VARIANT[freelancer.status] ?? "default"}
            label={freelancer.status.charAt(0) + freelancer.status.slice(1).toLowerCase()}
          />
        }
        description={freelancer.user.email}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow>Profile</Eyebrow>
              <TrackBadge track={freelancer.track} />
            </div>
            {freelancer.tagline && (
              <p className="mt-4 text-base font-bold text-slate-900">{freelancer.tagline}</p>
            )}
            {freelancer.bio ? (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{freelancer.bio}</p>
            ) : (
              !freelancer.tagline && <p className="mt-4 text-sm text-slate-400">No headline or bio provided yet.</p>
            )}
          </Card>

          {freelancer.skills.length > 0 && (
            <Card className="p-6">
              <Eyebrow className="mb-3">Skills</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((s) => (
                  <Tag key={s.skillId}>
                    {s.skill.name} <span className="ml-1.5 text-slate-400">· {s.level.toLowerCase()}</span>
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {freelancer.languages.length > 0 && (
            <Card className="p-6">
              <Eyebrow className="mb-3">Languages</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {freelancer.languages.map((l) => (
                  <Tag key={l.language}>
                    {l.language} <span className="ml-1.5 text-slate-400">· {l.proficiency.toLowerCase()}</span>
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {freelancer.portfolioItems.length > 0 && (
            <Card className="p-6">
              <Eyebrow className="mb-4">Portfolio</Eyebrow>
              <div className="space-y-4">
                {freelancer.portfolioItems.map((item) => (
                  <div key={item.id} className="border-l-2 border-indigo-200 pl-4">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description.slice(0, 150)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {voiceIntroFileId && (
            <Card className="p-6">
              <Eyebrow className="mb-2">Voice intro</Eyebrow>
              <p className="font-mono text-xs text-slate-500">File ID: {voiceIntroFileId}</p>
            </Card>
          )}
        </div>

        {/* Sidebar — actions */}
        <div className="space-y-4">
          <Card className="p-6">
            <Eyebrow className="mb-4">Update status</Eyebrow>
            <StatusForm freelancerId={freelancer.id} currentStatus={freelancer.status} />
          </Card>

          <Card className="p-6">
            <Eyebrow className="mb-3">Timeline</Eyebrow>
            <dl className="space-y-2 text-sm">
              {dates.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <dt className="text-slate-500">{d.label}</dt>
                  <dd className="font-semibold tabular-nums text-slate-800">
                    {new Date(d.value!).toLocaleDateString("en-GB")}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  )
}
