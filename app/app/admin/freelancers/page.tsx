import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListSection, ListRow } from "@/components/ui/list"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { trackLabel } from "@/components/features/track"
import { Users } from "lucide-react"

type StatusVariant = "active" | "cancelled" | "declined" | "default"

const STATUS_VARIANT: Record<string, StatusVariant> = {
  ACTIVE:   "active",
  ON_BREAK: "cancelled",
  REJECTED: "declined",
  REMOVED:  "cancelled",
}

export default async function AdminFreelancersPage() {
  await requireRole(["ADMIN", "TEAM"])

  const freelancers = await prismaAdmin.freelancer.findMany({
    include: {
      user:   { select: { email: true } },
      _count: { select: { projects: true, receivedOffers: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const active = freelancers.filter((f) => f.status === "ACTIVE")
  const other  = freelancers.filter((f) =>
    f.status !== "ACTIVE" && !["APPLIED","SCREENING","INTERVIEW","TRAINING"].includes(f.status)
  )

  function Row({ f }: { f: typeof freelancers[0] }) {
    return (
      <ListRow
        href={`/app/admin/applications/${f.id}`}
        title={f.alias ?? "—"}
        subtitle={<p className="truncate">{f.user.email} · {trackLabel(f.track)}</p>}
      >
        <span className="hidden text-xs text-slate-500 sm:block">{f._count.projects} projects</span>
        <StatusBadge
          variant={STATUS_VARIANT[f.status] ?? "default"}
          label={f.status.charAt(0) + f.status.slice(1).toLowerCase().replace(/_/g, " ")}
          dot={false}
        />
      </ListRow>
    )
  }

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Freelancers" description={`${active.length} active`} />

      {freelancers.length === 0 && <EmptyState icon={Users} title="No freelancers yet" />}

      {active.length > 0 && (
        <ListSection title="Active" count={active.length}>
          {active.map((f) => <Row key={f.id} f={f} />)}
        </ListSection>
      )}

      {other.length > 0 && (
        <ListSection title="Inactive / removed" count={other.length}>
          {other.map((f) => <Row key={f.id} f={f} />)}
        </ListSection>
      )}
    </PlatformLayout>
  )
}
