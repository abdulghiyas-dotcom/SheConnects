"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormError } from "@/components/ui/field"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"

interface Props {
  initialData: {
    legalFirstName: string
    legalLastName: string
    dateOfBirth: Date | null
    countryOfResidence: string | null
    cityOfResidence: string | null
  } | null
}

export function AboutYouForm({ initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    legalFirstName: initialData?.legalFirstName ?? "",
    legalLastName: initialData?.legalLastName ?? "",
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
      : "",
    countryOfResidence: initialData?.countryOfResidence ?? "",
    cityOfResidence: initialData?.cityOfResidence ?? "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/apply/about-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/track")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardShell
      currentStep={2}
      title="About you"
      subtitle="This information is private and never shown to clients."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name (legal)" htmlFor="firstName">
            <Input
              id="firstName"
              value={form.legalFirstName}
              onChange={(e) => update("legalFirstName", e.target.value)}
              placeholder="Fatima"
              required
            />
          </Field>
          <Field label="Last name (legal)" htmlFor="lastName">
            <Input
              id="lastName"
              value={form.legalLastName}
              onChange={(e) => update("legalLastName", e.target.value)}
              placeholder="Ahmadi"
              required
            />
          </Field>
        </div>

        <Field label="Date of birth" htmlFor="dob">
          <Input
            id="dob"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Country of residence" htmlFor="country">
            <Input
              id="country"
              value={form.countryOfResidence}
              onChange={(e) => update("countryOfResidence", e.target.value)}
              placeholder="Italy"
            />
          </Field>
          <Field label="City" htmlFor="city">
            <Input
              id="city"
              value={form.cityOfResidence}
              onChange={(e) => update("cityOfResidence", e.target.value)}
              placeholder="Milan"
            />
          </Field>
        </div>

        <FormError>{error}</FormError>

        <WizardActions>
          <span />
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </WizardActions>
      </form>
    </WizardShell>
  )
}
