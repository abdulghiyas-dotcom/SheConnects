import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { PlatformLayout } from "@/components/features/platform-layout"
import { EmptyState } from "@/components/ui/empty-state"
import { formatEur } from "@/lib/utils/pricing"
import { Users } from "lucide-react"

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
    <PlatformLayout variant="admin" title="Clients">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">{clients.length} registered</p>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
            <EmptyState icon={Users} title="No clients yet" />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-card divide-y divide-slate-50 overflow-hidden">
            {clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800">{c.organizationName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.user.email}
                    {c.billingCountry ? ` · ${c.billingCountry}` : ""}
                    {c.vatNumber ? ` · VAT: ${c.vatNumber}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-xs text-slate-400">
                  <div className="text-right hidden sm:block">
                    <p>{c._count.projects} projects</p>
                    <p>{c._count.offers} offers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 tabular-nums">
                      {formatEur(Number(c.totalSpentCents))}
                    </p>
                    <p>total spent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
