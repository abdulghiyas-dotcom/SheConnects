"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"
import { IconTile } from "@/components/ui/icon-tile"
import { FormError } from "@/components/ui/field"

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
        <div className="flex flex-col items-center py-6 text-center">
          <IconTile icon={CheckCircle2} tone="emerald" size="lg" className="mb-5" />
          <h2 className="text-xl font-black tracking-tight text-slate-900">You&apos;re all set</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            Your application is being reviewed by the SheConnects team. We&apos;ll be in touch within a few days.
          </p>
          <Button className="mt-7" onClick={() => router.push("/app/freelancer/dashboard")}>
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
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">{section.title}</p>
              <Link
                href={section.editPath}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
              >
                <Pencil size={12} /> Edit
              </Link>
            </div>
            <dl className="space-y-1.5">
              {section.rows.map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <dt className="w-28 shrink-0 text-slate-500">{row.label}</dt>
                  <dd className="min-w-0 text-slate-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <FormError>{error}</FormError>

        <p className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm leading-relaxed text-indigo-700">
          By submitting, you confirm that all information is accurate and you agree to the SheConnects
          freelancer terms.
        </p>

        <WizardActions>
          <Button variant="ghost" onClick={() => router.push("/app/apply/voice")}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit application"}
          </Button>
        </WizardActions>
      </div>
    </WizardShell>
  )
}
