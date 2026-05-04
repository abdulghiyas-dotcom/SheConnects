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
import { Building2, User2, ShieldCheck, ArrowRight } from "lucide-react"

const ORG_TYPES = [
  { value: "ngo",              label: "NGO / Non-profit" },
  { value: "sme",              label: "Small or medium business" },
  { value: "social_enterprise", label: "Social enterprise" },
  { value: "foundation",       label: "Foundation" },
  { value: "other",            label: "Other" },
]

export default function SignUpPage() {
  const router = useRouter()

  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [orgName, setOrgName] = useState("")
  const [orgType, setOrgType] = useState("")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState<"split" | "verify">("split")
  const [otp, setOtp]         = useState("")

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
          data: { role: "CLIENT", organizationName: orgName, organizationType: orgType },
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

      if (!data.session) { setStep("verify"); return }
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
        setError(
          verifyError.message.includes("expired") || verifyError.message.includes("invalid")
            ? "Invalid or expired code. Check your email and try again."
            : verifyError.message
        )
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

  const inputClass = "h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
  const labelClass = "text-sm font-medium text-white/60"

  /* ── Email verify step ── */
  if (step === "verify") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12" style={{ background: "#080810" }}>
        <Link href="/" className="mb-10 flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
          <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">SheConnects</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 mb-4">
              <ShieldCheck size={22} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Check your email</h1>
            <p className="mt-1.5 text-sm text-white/40">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-white/70">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="otp" className={labelClass}>Confirmation code</Label>
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
                className={`${inputClass} text-center text-lg font-mono tracking-widest`}
              />
              <p className="text-xs text-white/25">You can also click the confirmation link in the email.</p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold border-0 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 0 20px rgba(79,70,229,0.35)" }}
              disabled={loading}
            >
              {loading ? "Verifying…" : "Confirm email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
              onClick={() => { setStep("split"); setOtp(""); setError("") }}
            >
              ← Back to sign up
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Two-column split ── */
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#080810" }}>
      {/* Top nav bar */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SheConnects" width={28} height={28} className="rounded-full" />
          <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-sm">SheConnects</span>
        </Link>
        <p className="text-sm text-white/30">
          Already have an account?{" "}
          <Link href="/app/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Split body */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LEFT — Organisation form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 lg:border-r lg:border-white/[0.05]">
          <div className="w-full max-w-sm">
            {/* Role indicator */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                <Building2 size={14} className="text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-indigo-400">For organisations</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">Create your account</h2>
            <p className="mt-1 text-sm text-white/40">Join as an organisation — it&apos;s free to sign up</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={labelClass}>Work email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.com"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={labelClass}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="orgName" className={labelClass}>Organisation name</Label>
                <Input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Foundation"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="orgType" className={labelClass}>Organisation type</Label>
                <Select value={orgType} onValueChange={setOrgType} required>
                  <SelectTrigger id="orgType" className={`${inputClass} text-left`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F0F1A] border-white/10">
                    {ORG_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value} className="text-white hover:bg-white/5">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold border-0 hover:-translate-y-0.5 transition-all mt-1"
                style={{ boxShadow: "0 0 20px rgba(79,70,229,0.35)" }}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider label for mobile */}
        <div className="flex items-center gap-4 px-6 py-4 lg:hidden">
          <div className="flex-1 border-t border-white/8" />
          <span className="text-xs text-white/25 uppercase tracking-widest">or</span>
          <div className="flex-1 border-t border-white/8" />
        </div>

        {/* RIGHT — Freelancer card */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14">
          <div className="w-full max-w-sm">
            <div
              className="rounded-2xl border border-white/8 p-8 text-center"
              style={{ background: "#0F0F1A" }}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <User2 size={28} className="text-purple-400" />
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">I am an Afghan woman</h2>
              <p className="mt-2 text-sm text-white/45 leading-relaxed">
                Join our network of professional freelancers. Apply to create your profile and start receiving projects.
              </p>

              <ul className="mt-6 space-y-2 text-left mb-7">
                {[
                  "Free to apply — no upfront cost",
                  "Privacy-protected identity",
                  "Work with organisations across Europe",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/50">
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/app/apply"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-500/20 hover:-translate-y-0.5"
              >
                Apply as a freelancer
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
