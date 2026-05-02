import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AdminNav } from "@/components/features/admin-nav"
import { formatEur } from "@/lib/utils/pricing"

export default async function AdminClientsPage() {
  await requireRole(["ADMIN", "TEAM"])

  const clients = await prismaAdmin.client.findMany({
    include: {
      user: { select: { email: true, createdAt: true } },
      _count: { select: { projects: true, offers: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminNav active="clients" />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
        <p className="text-muted-foreground -mt-4">{clients.length} registered</p>

        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {clients.length === 0 && (
            <p className="text-muted-foreground px-5 py-4 text-sm">No clients yet.</p>
          )}
          {clients.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium text-sm">{c.organizationName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.user.email} · {c.billingCountry ?? "country not set"}
                  {c.vatNumber ? ` · VAT: ${c.vatNumber}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-xs text-muted-foreground">
                <div className="text-right">
                  <p>{c._count.projects} projects</p>
                  <p>{c._count.offers} offers</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatEur(Number(c.totalSpentCents))}</p>
                  <p>total spent</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
