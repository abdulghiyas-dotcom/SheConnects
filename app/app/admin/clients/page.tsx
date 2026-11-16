import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ListRow } from "@/components/ui/list"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { InitialsAvatar } from "@/components/ui/initials-avatar"
import { formatEur } from "@/lib/utils/pricing"
import { Building2 } from "lucide-react"

export default async function AdminClientsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const clients = await prismaAdmin.client.findMany({
    include: {
      user:   { select: { email: true, createdAt: true } },
      _count: { select: { projects: true, offers: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PlatformLayout variant="admin">
      <PageHeader title="Clients" description={`${clients.length} registered`} />

      {clients.length === 0 ? (
        <EmptyState icon={Building2} title="No clients yet" />
      ) : (
        <Card className="divide-y divide-slate-100 overflow-hidden">
          {clients.map((c) => (
            <ListRow
              key={c.id}
              title={
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={c.organizationName} size="sm" />
                  <span className="truncate">{c.organizationName}</span>
                </div>
              }
              subtitle={
                <p className="truncate pl-11">
                  {c.user.email}
                  {c.billingCountry ? ` · ${c.billingCountry}` : ""}
                  {c.vatNumber ? ` · VAT: ${c.vatNumber}` : ""}
                </p>
              }
            >
              <div className="hidden text-right text-xs text-slate-500 sm:block">
                <p>{c._count.projects} projects</p>
                <p>{c._count.offers} offers</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-slate-900">
                  {formatEur(Number(c.totalSpentCents))}
                </p>
                <p className="text-xs text-slate-400">total spent</p>
              </div>
            </ListRow>
          ))}
        </Card>
      )}
    </PlatformLayout>
  )
}
