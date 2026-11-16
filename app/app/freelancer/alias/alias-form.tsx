"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, Eyebrow } from "@/components/ui/card"
import { ChoiceChip } from "@/components/ui/badge"
import { Callout } from "@/components/ui/callout"
import { Field, FormError } from "@/components/ui/field"

function toSlug(alias: string): string {
  return alias
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

interface Props {
  currentAlias: string
  suggestions: string[]
}

type AvailabilityState = "idle" | "checking" | "available" | "taken" | "yours"

export function AliasForm({ currentAlias, suggestions }: Props) {
  const router = useRouter()
  const [alias, setAlias] = useState(currentAlias)
  const [availability, setAvailability] = useState<AvailabilityState>("yours")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const slug = toSlug(alias)

  const checkAvailability = useCallback(async (value: string) => {
    const s = toSlug(value)
    if (!s || s.length < 2) {
      setAvailability("idle")
      return
    }

    setAvailability("checking")

    try {
      const res = await fetch(`/api/freelancer/alias?slug=${encodeURIComponent(s)}`)
      const data = await res.json()
      if (data.yours) setAvailability("yours")
      else if (data.available) setAvailability("available")
      else setAvailability("taken")
    } catch {
      setAvailability("idle")
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!alias.trim()) {
      setAvailability("idle")
      return
    }
    debounceRef.current = setTimeout(() => checkAvailability(alias), 450)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [alias, checkAvailability])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const res = await fetch("/api/freelancer/alias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      setSaved(true)
      setTimeout(() => {
        router.push("/app/freelancer/dashboard")
        router.refresh()
      }, 1200)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const canSave =
    alias.trim().length >= 2 &&
    alias.trim().length <= 40 &&
    (availability === "available" || availability === "yours") &&
    !saving

  return (
    <div className="max-w-xl space-y-4">
      <Card className="space-y-6 p-6 sm:p-8">
        {suggestions.length > 0 && (
          <div>
            <Eyebrow className="mb-2.5">Suggestions</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <ChoiceChip key={s} selected={alias === s} onClick={() => setAlias(s)}>
                  {s}
                </ChoiceChip>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Your alias" htmlFor="alias">
            <div className="relative">
              <Input
                id="alias"
                value={alias}
                onChange={(e) => { setAlias(e.target.value); setSaved(false) }}
                placeholder="e.g. Fatima A."
                maxLength={40}
                autoComplete="off"
                className="pr-10"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {availability === "checking" && <Loader2 size={15} className="animate-spin text-slate-400" />}
                {(availability === "available" || availability === "yours") && alias.trim().length >= 2 && (
                  <Check size={15} className="text-emerald-500" />
                )}
                {availability === "taken" && <X size={15} className="text-red-500" />}
              </div>
            </div>

            {/* Availability message */}
            {availability === "taken" && (
              <p className="text-xs font-medium text-red-600">This alias is already taken.</p>
            )}
            {availability === "available" && (
              <p className="text-xs font-medium text-emerald-600">Available!</p>
            )}
            {availability === "yours" && alias === currentAlias && (
              <p className="text-xs text-slate-400">This is your current alias.</p>
            )}

            {/* Slug preview */}
            {slug && (
              <p className="text-xs text-slate-400">
                Public profile:{" "}
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">/freelancers/{slug}</span>
              </p>
            )}
          </Field>

          <FormError>{error}</FormError>

          {saved && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check size={14} /> Alias saved — redirecting…
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/app/freelancer/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave}>
              {saving ? "Saving…" : "Save alias"}
            </Button>
          </div>
        </form>
      </Card>

      <Callout tone="indigo" icon={ShieldCheck} title="Tips for a good alias">
        <ul className="list-inside list-disc space-y-0.5 text-xs">
          <li>Use only your first name, or first name + last initial (e.g. &ldquo;Fatima A.&rdquo;)</li>
          <li>Avoid your full legal name — this protects your privacy</li>
          <li>You can change your alias again at any time</li>
        </ul>
      </Callout>
    </div>
  )
}
