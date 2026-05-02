"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WizardShell } from "@/components/features/application-wizard"

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
        <div className="space-y-2">
          <Label htmlFor="tagline">
            Professional headline <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Dari–English translator with 5 years in legal and NGO work"
            maxLength={120}
          />
          <p className="text-xs text-muted-foreground">{tagline.length}/120</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About you</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            placeholder="Describe your background, skills, and what kind of projects you enjoy. At least 50 characters."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
          <p className="text-xs text-muted-foreground">{bio.length} characters</p>
        </div>

        <div className="space-y-3">
          <Label>Languages</Label>
          {languages.map((lang, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={lang.language}
                onChange={(e) => updateLanguage(i, "language", e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(i, "proficiency", e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {PROFICIENCY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLanguage(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
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
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus size={14} /> Add language
            </button>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/skills")}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </WizardShell>
  )
}
