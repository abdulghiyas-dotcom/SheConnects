"use client"

import { useRouter } from "next/navigation"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

export default function VoicePage() {
  const router = useRouter()

  return (
    <WizardShell
      currentStep={8}
      title="Voice intro"
      subtitle="A 60-second voice message lets clients hear you before they hire you."
    >
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
          <Mic className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-sm font-medium text-foreground">Voice recording coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">
            You can record your voice intro after your application is reviewed.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Your voice intro is optional but highly recommended — applicants with voice intros receive
          significantly more enquiries from clients.
        </p>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/identity")}>
            Back
          </Button>
          <Button onClick={() => router.push("/app/apply/review")}>
            Continue
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
