"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, NativeSelect } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Field, FormError } from "@/components/ui/field"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"

const LANGUAGE_OPTIONS = [
  "Dari",
  "Pashto",
  "Farsi",
  "English",
  "Italian",
  "German",
  "French",
  "Arabic",
  "Urdu",
  "Other",
]

const PROFICIENCY_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
]

interface LangEntry {
  language: string
  proficiency: string
}

interface Props {
  initialData: {
    tagline: string | null
    bio: string | null
    languages: LangEntry[]
  }
}

export function ExperienceForm({ initialData }: Props) {
  const router = useRouter()
  const [tagline, setTagline] = useState(initialData.tagline ?? "")
  const [bio, setBio] = useState(initialData.bio ?? "")
  const [languages, setLanguages] = useState<LangEntry[]>(
    initialData.languages.length > 0
      ? initialData.languages
      : [{ language: "Dari", proficiency: "NATIVE" }]
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function addLanguage() {
    setLanguages((prev) => [...prev, { language: "English", proficiency: "FLUENT" }])
  }

  function removeLanguage(i: number) {
    setLanguages((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateLanguage(i: number, field: keyof LangEntry, value: string) {
    setLanguages((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (bio.trim().length < 50) {
      setError("Bio must be at least 50 characters. Tell clients about your background and strengths.")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/apply/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagline, bio, languages }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/portfolio")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardShell
      currentStep={5}
      title="Your experience"
      subtitle="Write in the language you're most comfortable with — English, Dari, or Italian."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Professional headline" htmlFor="tagline" optional hint={`${tagline.length}/120`}>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Dari–English translator with 5 years in legal and NGO work"
            maxLength={120}
          />
        </Field>

        <Field label="About you" htmlFor="bio" hint={`${bio.length} characters`}>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            placeholder="Describe your background, skills, and what kind of projects you enjoy. At least 50 characters."
          />
        </Field>

        <div className="space-y-3">
          <Label>Languages</Label>
          {languages.map((lang, i) => (
            <div key={i} className="flex items-center gap-2">
              <NativeSelect
                aria-label="Language"
                value={lang.language}
                onChange={(e) => updateLanguage(i, "language", e.target.value)}
                className="flex-1"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </NativeSelect>
              <NativeSelect
                aria-label="Proficiency"
                value={lang.proficiency}
                onChange={(e) => updateLanguage(i, "proficiency", e.target.value)}
                className="flex-1"
              >
                {PROFICIENCY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </NativeSelect>
              {languages.length > 1 && (
                <button
                  type="button"
                  aria-label="Remove language"
                  onClick={() => removeLanguage(i)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {languages.length < 6 && (
            <button
              type="button"
              onClick={addLanguage}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              <Plus size={14} /> Add language
            </button>
          )}
        </div>

        <FormError>{error}</FormError>

        <WizardActions>
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/skills")}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </WizardActions>
      </form>
    </WizardShell>
  )
}
