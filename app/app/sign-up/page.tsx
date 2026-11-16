"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormError } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { IconTile } from "@/components/ui/icon-tile"
import { buttonVariants } from "@/components/ui/button"
import { AuthShell, authLinkClass } from "@/components/features/auth-shell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User2, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react"

const ORG_TYPES = [
  { value: "ngo",               label: "NGO / Non-profit" },
  { value: "sme",               label: "Small or medium business" },
  { value: "social_enterprise", label: "Social enterprise" },
  { value: "foundation",        label: "Foundation" },
  { value: "other",             label: "Other" },
]

export default function SignUpPage() {
  const router = useRouter()
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

  /* ── Two-column split ── */
  return (
    <AuthShell
      bare
      topRight={<>Already have an account? <Link href="/app/sign-in" className={authLinkClass}>Sign in</Link></>}
    >
      <div className="flex flex-1 flex-col lg:flex-row">

        {/* LEFT — Org form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14">
          <div className="w-full max-w-sm">
            <Badge tone="indigo" eyebrow className="mb-6"><Building2 size={11} /> For organisations</Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-500">Join as an organisation — free to sign up</p>

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
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider - mobile only */}
        <div className="flex items-center gap-4 px-6 lg:hidden">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">or</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* RIGHT — Freelancer card */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 lg:border-l lg:border-slate-100 lg:bg-slate-50/80">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200/70 bg-white p-8 shadow-card">
            <Badge tone="purple" eyebrow className="mb-6"><User2 size={11} /> For Afghan women</Badge>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">I am an Afghan woman</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Apply to join our network of vetted professionals and start receiving projects.</p>

            <ul className="mt-6 space-y-3">
              {[
                "Free to apply — no upfront cost",
                "Privacy-protected identity",
                "Projects from organisations across Europe",
                "Ongoing support and onboarding",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={15} className="flex-shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/app/apply" className={buttonVariants({ variant: "outline", size: "lg", className: "mt-8 w-full" })}>
              Apply as a freelancer
              <ArrowRight size={14} />
            </Link>

            <p className="mt-4 text-center text-xs text-slate-500">Already have an account?{" "}
              <Link href="/app/sign-in?role=freelancer" className={authLinkClass}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}
