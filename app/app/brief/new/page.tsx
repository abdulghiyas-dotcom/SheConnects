import { requireRole } from "@/lib/auth/server"
import { PlatformLayout } from "@/components/features/platform-layout"
import { PageHeader } from "@/components/ui/page-header"
import { BriefBuilder } from "./brief-builder"

export default async function NewBriefPage() {
  await requireRole("CLIENT")

  return (
    <PlatformLayout variant="client">
      <PageHeader
        title="New project brief"
        description="Describe what you need — our AI will classify it and suggest scope. You can edit before saving."
      />

      <div className="max-w-2xl">
        <BriefBuilder />
      </div>
    </PlatformLayout>
  )
}
