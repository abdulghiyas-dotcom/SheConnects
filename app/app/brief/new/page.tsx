import { requireRole } from "@/lib/auth/server"
import { ClientNav } from "@/components/features/client-nav"
import { BriefBuilder } from "./brief-builder"

export default async function NewBriefPage() {
  await requireRole("CLIENT")

  return (
    <div className="min-h-screen bg-secondary/30">
      <ClientNav active="brief" />

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">New project brief</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Describe what you need — our AI will classify it and suggest scope. You can edit before saving.
          </p>
        </div>

        <BriefBuilder />
      </main>
    </div>
  )
}
