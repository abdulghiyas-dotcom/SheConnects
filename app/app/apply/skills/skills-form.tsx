"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => {
                const isSelected = selected.has(skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggle(skill.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-all",
                      isSelected
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-foreground border-border hover:border-brand-400"
                    )}
                  >
                    {skill.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No skills found for your track. You can add them later from your profile.
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground">
          {selected.size} skill{selected.size !== 1 ? "s" : ""} selected
        </p>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/track")}>
            Back
          </Button>
          <Button type="submit" disabled={loading || selected.size === 0}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </WizardShell>
  )
}
