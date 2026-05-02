"use client"

import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

export default function IdentityPage() {
  const router = useRouter()

  return (
    <WizardShell
      currentStep={7}
      title="Verification"
      subtitle="We verify your identity to build trust with clients — your documents are never shared."
    >
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
          <ShieldCheck className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-sm font-medium text-foreground">Identity verification coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">
            Our team will contact you to verify your identity after your application is submitted.
          </p>
        </div>

        <div className="rounded-lg bg-trust-50 border border-trust-200 p-4 text-sm text-trust-800">
          <p className="font-medium mb-1">Your documents are private</p>
          <p className="text-trust-700">
            Identity documents are stored encrypted and only accessed by SheConnects staff. They are never
            shared with clients or visible on your profile.
          </p>
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/portfolio")}>
            Back
          </Button>
          <Button onClick={() => router.push("/app/apply/voice")}>
            Continue
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
