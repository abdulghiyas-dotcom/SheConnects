"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const inputClass = "h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
  const labelClass = "text-sm font-semibold text-slate-700"

  /* ── Email verify step ── */
  if (step === "verify") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16">
        <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, #EEF2FF 0%, transparent 70%)" }} />
        <Link href="/" className="relative mb-10 flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">SheConnects</span>
        </Link>
        <div className="relative w-full max-w-sm">
          <div className="mb-8 flex flex-col items-start">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100"><ShieldCheck size={22} className="text-indigo-600" /></div>
            <h1 className="text-2xl font-black text-slate-900">Check your email</h1>
            <p className="mt-1.5 text-sm text-slate-500">We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></p>
          </div>
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="otp" className={labelClass}>Confirmation code</Label>
              <Input id="otp" type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} required autoComplete="one-time-code" autoFocus className={`${inputClass} text-center text-xl font-mono tracking-widest`} />
              <p className="text-xs text-slate-400">Or click the confirmation link in the email.</p>
            </div>
            {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold border-0" disabled={loading}>
              {loading ? "Verifying…" : "Confirm email"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button type="button" className="text-sm text-slate-400 hover:text-slate-700 transition-colors" onClick={() => { setStep("split"); setOtp(""); setError("") }}>
              ← Back to sign up
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Two-column split ── */
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SheConnects" width={28} height={28} className="rounded-full" />
          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">SheConnects</span>
        </Link>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/app/sign-in" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 flex-col lg:flex-row">

        {/* LEFT — Org form */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-14 lg:border-r lg:border-slate-100">
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, #EEF2FF 0%, transparent 70%)" }} />
          <div className="relative w-full max-w-sm">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
              <Building2 size={12} /> For organisations
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Create your account</h2>
            <p className="mt-1 text-sm text-slate-500">Join as an organisation — free to sign up</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={labelClass}>Work email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" required autoComplete="email" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className={labelClass}>Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required autoComplete="new-password" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="orgName" className={labelClass}>Organisation name</Label>
                <Input id="orgName" type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Foundation" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="orgType" className={labelClass}>Organisation type</Label>
                <Select value={orgType} onValueChange={setOrgType} required>
                  <SelectTrigger id="orgType" className={`${inputClass} text-left`}><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{ORG_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold border-0 mt-1" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider - mobile only */}
        <div className="flex items-center gap-4 px-6 py-4 lg:hidden">
          <div className="flex-1 border-t border-slate-100" />
          <span className="text-xs text-slate-300 uppercase tracking-widest">or</span>
          <div className="flex-1 border-t border-slate-100" />
        </div>

        {/* RIGHT — Freelancer card */}
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-14">
          <div className="w-full max-w-sm">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600">
              <User2 size={12} /> For Afghan women
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">I am an Afghan woman</h2>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">Apply to join our network of vetted professionals and start receiving projects.</p>

            <ul className="mt-7 space-y-3">
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

            <Link
              href="/app/apply"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-purple-200 bg-white px-6 py-3.5 text-sm font-bold text-purple-700 shadow-sm transition-all hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5"
            >
              Apply as a freelancer
              <ArrowRight size={14} />
            </Link>

            <p className="mt-4 text-center text-xs text-slate-400">Already have an account?{" "}
              <Link href="/app/sign-in?role=freelancer" className="font-semibold text-purple-600 hover:text-purple-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
