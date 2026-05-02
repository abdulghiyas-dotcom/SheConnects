"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

interface Section {
  title: string
  editPath: string
  rows: { label: string; value: string }[]
}

interface Props {
  sections: Section[]
  userId: string
}

export function ReviewClient({ sections, userId: _ }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/apply/submit", {
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Submission failed. Please try again.")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <WizardShell currentStep={9} title="Application submitted">
        <div className="text-center py-8 space-y-4">
          <CheckCircle2 className="mx-auto text-trust-500" size={48} />
          <div>
            <h2 className="text-lg font-semibold">You're all set</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Your application is being reviewed by the SheConnects team. We'll be in touch within a few days.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/app/freelancer/dashboard")}>
            Go to your dashboard
          </Button>
        </div>
      </WizardShell>
    )
  }

  return (
    <WizardShell
      currentStep={9}
      title="Review & submit"
      subtitle="Check everything looks right before you submit your application."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">{section.title}</p>
              <Link
                href={section.editPath}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Pencil size={12} /> Edit
              </Link>
            </div>
            <div className="space-y-1.5">
              {section.rows.map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground w-28 shrink-0">{row.label}</span>
                  <span className="text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="rounded-lg bg-brand-50 border border-brand-200 p-4 text-sm text-brand-800">
          By submitting, you confirm that all information is accurate and you agree to the SheConnects
          freelancer terms.
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/voice")}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
