"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormError } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { IconTile } from "@/components/ui/icon-tile"
import { AuthShell, authLinkClass } from "@/components/features/auth-shell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User2, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils/cn"

// The two ways to join. Shown side by side with equal weight so nobody is
// pushed into the wrong one by default.
const PATHS = [
  {
    key: "organisation",
    href: "/app/sign-up?role=client",
    icon: Building2,
    tone: "indigo" as const,
    eyebrow: "For organisations",
    title: "I'm hiring",
    lead: "NGOs, foundations, social enterprises and businesses looking for skilled remote professionals.",
    points: [
      "Browse vetted Afghan women professionals",
      "Send offers and agree on scope and price",
      "Track milestones and pay securely",
    ],
    next: "Takes 1 minute — create your organisation account",
    cta: "Join as an organisation",
    accent: {
      card: "hover:border-indigo-300 focus-visible:ring-indigo-500",
      bar: "bg-indigo-600",
      button: "bg-indigo-600 group-hover:bg-indigo-700",
    },
  },
  {
    key: "freelancer",
    href: "/app/apply",
    icon: User2,
    tone: "purple" as const,
    eyebrow: "For Afghan women",
    title: "I'm looking for work",
    lead: "Afghan women professionals in tech, design, translation or research who want paid remote projects.",
    points: [
      "Free to apply — no upfront cost",
      "Your real name stays private behind an alias",
      "Projects from organisations across Europe",
    ],
    next: "Takes about 10 minutes — a short application we review",
    cta: "Apply as a freelancer",
    accent: {
      card: "hover:border-purple-300 focus-visible:ring-purple-500",
      bar: "bg-purple-600",
      button: "bg-purple-600 group-hover:bg-purple-700",
    },
  },
]

const ORG_TYPES = [
  { value: "ngo",               label: "NGO / Non-profit" },
  { value: "sme",               label: "Small or medium business" },
  { value: "social_enterprise", label: "Social enterprise" },
  { value: "foundation",        label: "Foundation" },
  { value: "other",             label: "Other" },
]

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOrgForm = searchParams.get("role") === "client"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [orgName, setOrgName] = useState("")
  const [orgType, setOrgType] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"split" | "verify">("split")
  const [otp, setOtp] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${origin}/app/auth/callback?next=/app/client/dashboard`,
          data: { role: "CLIENT", organizationName: orgName, organizationType: orgType },
        },
      })
      if (authError) { setError(authError.message.includes("already registered") ? "An account with this email already exists." : authError.message); return }
      if (!data.session) { setStep("verify"); return }
      await createClientProfile(orgName, orgType)
    } catch { setError("Something went wrong. Please try again.") }
    finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "signup" })
      if (verifyError) { setError(verifyError.message.includes("expired") || verifyError.message.includes("invalid") ? "Invalid or expired code. Check your email." : verifyError.message); return }
      await createClientProfile(orgName, orgType)
    } catch { setError("Something went wrong. Please try again.") }
    finally { setLoading(false) }
  }

  async function createClientProfile(orgNameVal: string, orgTypeVal: string) {
    const res = await fetch("/api/auth/create-client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, orgName: orgNameVal, orgType: orgTypeVal }) })
    if (!res.ok) { setError("Account created but profile setup failed. Please sign in and try again."); return }
    router.push("/app/client/dashboard")
    router.refresh()
  }

  /* ── Email verify step ── */
  if (step === "verify") {
    return (
      <AuthShell>
        <div className="w-full max-w-sm">
          <IconTile icon={ShieldCheck} tone="indigo" size="lg" className="mb-5" />
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Check your email</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="mt-8 space-y-4">
            <Field label="Confirmation code" htmlFor="otp" hint="Or click the confirmation link in the email.">
              <Input id="otp" type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} required autoComplete="one-time-code" autoFocus className="h-14 text-center font-mono text-xl tracking-[0.4em]" />
            </Field>
            <FormError>{error}</FormError>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Confirm email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600" onClick={() => { setStep("split"); setOtp(""); setError("") }}>
              ← Back to sign up
            </button>
          </div>
        </div>
      </AuthShell>
    )
  }

  /* ── Step 1: choose how to join ── */
  if (!isOrgForm) {
    return (
      <AuthShell
        topRight={<><span className="hidden sm:inline">Already have an account? </span><Link href="/app/sign-in" className={authLinkClass}>Sign in</Link></>}
      >
        <div className="mb-10 max-w-xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">How would you like to join?</h1>
          <p className="mt-3 text-base text-slate-500">
            SheConnects has two kinds of accounts. Pick the one that describes you.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-5 md:grid-cols-2">
          {PATHS.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:p-8",
                p.accent.card
              )}
            >
              <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1.5", p.accent.bar)} />

              <div className="flex items-center gap-4">
                <IconTile icon={p.icon} tone={p.tone} size="lg" />
                <Badge tone={p.tone} eyebrow>{p.eyebrow}</Badge>
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.lead}</p>

              <ul className="mt-6 space-y-3">
                {p.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <span
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-sm transition-colors",
                    p.accent.button
                  )}
                >
                  {p.cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
                <p className="mt-3 text-center text-xs text-slate-400">{p.next}</p>
              </div>
            </Link>
          ))}
        </div>
      </AuthShell>
    )
  }

  /* ── Step 2: organisation account form ── */
  return (
    <AuthShell
      topLeft={
        <Link
          href="/app/sign-up"
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Choose account type
        </Link>
      }
      topRight={<><span className="hidden sm:inline">Already have an account? </span><Link href="/app/sign-in?role=client" className={authLinkClass}>Sign in</Link></>}
    >
      <div className="w-full max-w-md">
        <Badge tone="indigo" eyebrow className="mb-6"><Building2 size={11} /> Organisation account</Badge>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Create your organisation account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Free to sign up. You can browse freelancers straight away.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field label="Work email" htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" required autoComplete="email" />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required autoComplete="new-password" />
          </Field>
          <Field label="Organisation name" htmlFor="orgName">
            <Input id="orgName" type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Foundation" required />
          </Field>
          <Field label="Organisation type" htmlFor="orgType">
            <Select value={orgType} onValueChange={setOrgType} required>
              <SelectTrigger id="orgType"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{ORG_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <FormError>{error}</FormError>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create organisation account"}
          </Button>
        </form>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50 px-5 py-4">
          <User2 size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
          <p className="text-sm leading-relaxed text-purple-900">
            Looking for work instead?{" "}
            <Link href="/app/apply" className="font-bold text-purple-700 underline-offset-4 hover:underline">
              Apply as a freelancer
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
