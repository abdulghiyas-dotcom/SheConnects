"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ORG_TYPES = [
  { value: "ngo", label: "NGO / Non-profit" },
  { value: "sme", label: "Small or medium business" },
  { value: "social_enterprise", label: "Social enterprise" },
  { value: "foundation", label: "Foundation" },
  { value: "other", label: "Other" },
]

export default function SignUpPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [orgName, setOrgName] = useState("")
  const [orgType, setOrgType] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"form" | "verify">("form")
  const [otp, setOtp] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/app/auth/callback?next=/app/client/dashboard`,
          data: {
            role: "CLIENT",
            organizationName: orgName,
            organizationType: orgType,
          },
        },
      })

      if (authError) {
        setError(
          authError.message.includes("already registered")
            ? "An account with this email already exists."
            : authError.message
        )
        return
      }

      // Email confirmation required — session not yet established
      if (!data.session) {
        setStep("verify")
        return
      }

      await createClientProfile(orgName, orgType)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "signup",
      })

      if (verifyError) {
        setError(verifyError.message.includes("expired") || verifyError.message.includes("invalid")
          ? "Invalid or expired code. Check your email and try again."
          : verifyError.message)
        return
      }

      await createClientProfile(orgName, orgType)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function createClientProfile(orgNameVal: string, orgTypeVal: string) {
    const res = await fetch("/api/auth/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orgName: orgNameVal, orgType: orgTypeVal }),
    })

    if (!res.ok) {
      setError("Account created but profile setup failed. Please sign in and try again.")
      return
    }

    router.push("/app/client/dashboard")
    router.refresh()
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground">SheConnects</h1>
            <p className="text-sm text-muted-foreground mt-1">Digital work with human impact</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Confirmation code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    You can also click the confirmation link in the email instead.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying…" : "Confirm email"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => { setStep("form"); setOtp(""); setError("") }}
                >
                  ← Back
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">SheConnects</h1>
          <p className="text-sm text-muted-foreground mt-1">Digital work with human impact</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Join as an organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.com"
                  required
                  autoComplete="email"
                />
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

              <div className="space-y-2">
                <Label htmlFor="orgName">Organisation name</Label>
                <Input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Foundation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgType">Organisation type</Label>
                <Select value={orgType} onValueChange={setOrgType} required>
                  <SelectTrigger id="orgType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
              <p>
                Already have an account?{" "}
                <Link href="/app/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
              <p>
                Are you an Afghan woman professional?{" "}
                <Link href="/app/apply" className="text-primary hover:underline">
                  Apply here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
