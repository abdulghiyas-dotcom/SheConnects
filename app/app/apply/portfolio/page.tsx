"use client"

import { useRouter } from "next/navigation"
import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

export default function PortfolioPage() {
  const router = useRouter()

  return (
    <WizardShell
      currentStep={6}
      title="Portfolio"
      subtitle="Share examples of your past work so clients can see what you can do."
    >
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
          <FolderOpen className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-sm font-medium text-foreground">Portfolio uploads coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">
            You can add portfolio items after your application is reviewed.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Don't worry if you don't have portfolio pieces yet — you can skip this step and add work samples later
          from your dashboard.
        </p>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/experience")}>
            Back
          </Button>
          <Button onClick={() => router.push("/app/apply/identity")}>
            Continue
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
