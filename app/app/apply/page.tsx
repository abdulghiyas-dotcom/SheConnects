"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WizardShell } from "@/components/features/application-wizard"

export default function ApplyPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "FREELANCER" } },
      })

      if (authError) {
        setError(
          authError.message.includes("already registered")
            ? "An account with this email already exists. Sign in instead."
            : authError.message
        )
        return
      }

      const res = await fetch("/api/auth/create-freelancer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        setError("Account created but setup failed. Please sign in and continue.")
        return
      }

      router.push("/app/apply/about-you")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardShell currentStep={1} title="Create your account" subtitle="Your identity stays private — clients will only see an alias.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
          <p className="text-xs text-muted-foreground">
            Use a personal email. Work emails linked to organisations in Afghanistan may not be safe.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Start application"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already applied?{" "}
          <Link href="/app/sign-in" className="text-primary hover:underline">
            Sign in to continue
          </Link>
        </p>
      </form>
    </WizardShell>
  )
}
