import { requireRole } from "@/lib/auth/server"
import { PlatformLayout } from "@/components/features/platform-layout"
import { BriefBuilder } from "./brief-builder"

export default async function NewBriefPage() {
  await requireRole("CLIENT")

  return (
    <PlatformLayout variant="client" title="New Project Brief">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New project brief</h1>
          <p className="text-sm text-slate-500 mt-1">
            Describe what you need — our AI will classify it and suggest scope. You can edit before saving.
          </p>
        </div>

        <BriefBuilder />
      </div>
    </PlatformLayout>
  )
}
