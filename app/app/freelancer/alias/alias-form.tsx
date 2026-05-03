"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/cn"

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
    <div className="flex justify-center py-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Choose your alias</h1>
          <p className="text-sm text-muted-foreground mt-1">
            This is how clients will see you — your real name is never shown.
          </p>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAlias(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all",
                  alias === s
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-foreground border-border hover:border-brand-400"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alias">Your alias</Label>
            <div className="relative">
              <Input
                id="alias"
                value={alias}
                onChange={(e) => { setAlias(e.target.value); setSaved(false) }}
                placeholder="e.g. Fatima A."
                maxLength={40}
                autoComplete="off"
                className="pr-8"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {availability === "checking" && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                {(availability === "available" || availability === "yours") && alias.trim().length >= 2 && (
                  <Check size={14} className="text-trust-500" />
                )}
                {availability === "taken" && <X size={14} className="text-destructive" />}
              </div>
            </div>

            {/* Availability message */}
            {availability === "taken" && (
              <p className="text-xs text-destructive">This alias is already taken.</p>
            )}
            {availability === "available" && (
              <p className="text-xs text-trust-600">Available!</p>
            )}
            {availability === "yours" && alias === currentAlias && (
              <p className="text-xs text-muted-foreground">This is your current alias.</p>
            )}

            {/* Slug preview */}
            {slug && (
              <p className="text-xs text-muted-foreground">
                Public profile:{" "}
                <span className="font-mono text-foreground">/freelancers/{slug}</span>
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {saved && (
            <p className="text-sm text-trust-600 flex items-center gap-1.5">
              <Check size={14} /> Alias saved — redirecting…
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/app/freelancer/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!canSave}>
              {saving ? "Saving…" : "Save alias"}
            </Button>
          </div>
        </form>

        <div className="rounded-lg bg-secondary border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground text-sm">Tips for a good alias</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Use only your first name, or first name + last initial (e.g. "Fatima A.")</li>
            <li>Avoid your full legal name — this protects your privacy</li>
            <li>You can change your alias again at any time</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
