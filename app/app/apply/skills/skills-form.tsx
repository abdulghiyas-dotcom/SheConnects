"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"
import { ChoiceChip } from "@/components/ui/badge"
import { Eyebrow } from "@/components/ui/card"
import { FormError } from "@/components/ui/field"

interface Skill {
  id: string
  name: string
  category: string | null
}

interface Props {
  skills: Skill[]
  selectedIds: string[]
}

export function SkillsForm({ skills, selectedIds: initial }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set(initial))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected.size === 0) {
      setError("Select at least one skill to continue.")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/apply/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillIds: Array.from(selected) }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/experience")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardShell
      currentStep={4}
      title="Your skills"
      subtitle="Select everything you can offer. You can pick from multiple categories."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <Eyebrow className="mb-2.5">{category}</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <ChoiceChip key={skill.id} selected={selected.has(skill.id)} onClick={() => toggle(skill.id)}>
                  {skill.name}
                </ChoiceChip>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <p className="text-sm text-slate-500">
            No skills found for your track. You can add them later from your profile.
          </p>
        )}

        <FormError>{error}</FormError>

        <WizardActions>
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/track")}>
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500">
              {selected.size} skill{selected.size !== 1 ? "s" : ""} selected
            </span>
            <Button type="submit" disabled={loading || selected.size === 0}>
              {loading ? "Saving…" : "Continue"}
            </Button>
          </div>
        </WizardActions>
      </form>
    </WizardShell>
  )
}
