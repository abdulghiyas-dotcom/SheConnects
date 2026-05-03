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
import { ShieldCheck, Clock, Star } from "lucide-react"

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
  const [step, setStep]       = useState<"form" | "verify">("form")
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

  const leftPanel = (
    <div
      className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)" }}
    >
      <div className="absolute top-[-80px] right-[-80px] h-80 w-80 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] h-64 w-64 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="SheConnects" width={32} height={32} className="rounded-full" />
          <span className="text-white font-semibold text-lg">SheConnects</span>
        </Link>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Hire with purpose.<br />Impact with every project.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Access a curated pool of verified Afghan women professionals across tech, design, translation and research.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { icon: ShieldCheck, text: "All freelancers identity-verified" },
            { icon: Clock,       text: "Start working in under 48 hours" },
            { icon: Star,        text: "Avg. 4.8 rating across all projects" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Icon size={15} className="text-brand-300" />
              </div>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Why organisations choose us</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">✓</span> Managed contracts & milestone payments</li>
            <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">✓</span> Privacy-first — freelancer identities protected</li>
            <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">✓</span> EU/GDPR compliant billing & invoicing</li>
          </ul>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-600">© {new Date().getFullYear()} SheConnects · GDPR compliant</p>
    </div>
  )

  if (step === "verify") {
    return (
      <div className="flex min-h-screen">
        {leftPanel}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/icon.png" alt="SheConnects" width={28} height={28} className="rounded-full" />
            <span className="font-semibold text-slate-900">SheConnects</span>
          </Link>

          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 mb-4">
                <ShieldCheck size={22} className="text-brand-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Check your email</h1>
              <p className="mt-1 text-sm text-slate-500">
                We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-sm font-medium text-slate-700">Confirmation code</Label>
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
                  className="h-11 rounded-xl border-slate-200 text-center text-lg font-mono tracking-widest focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
                <p className="text-xs text-slate-400">You can also click the confirmation link in the email.</p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand font-medium"
                disabled={loading}
              >
                {loading ? "Verifying…" : "Confirm email"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-700"
                onClick={() => { setStep("form"); setOtp(""); setError("") }}
              >
                ← Back to sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {leftPanel}

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <Image src="/icon.png" alt="SheConnects" width={28} height={28} className="rounded-full" />
          <span className="font-semibold text-slate-900">SheConnects</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Join as an organisation — it&apos;s free to sign up</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organisation.com"
                required
                autoComplete="email"
                className="h-11 rounded-xl border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
                autoComplete="new-password"
                className="h-11 rounded-xl border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgName" className="text-sm font-medium text-slate-700">Organisation name</Label>
              <Input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Foundation"
                required
                className="h-11 rounded-xl border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgType" className="text-sm font-medium text-slate-700">Organisation type</Label>
              <Select value={orgType} onValueChange={setOrgType} required>
                <SelectTrigger id="orgType" className="h-11 rounded-xl border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand font-medium"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
            <p>
              Already have an account?{" "}
              <Link href="/app/sign-in" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                Sign in
              </Link>
            </p>
            <p>
              Are you an Afghan woman professional?{" "}
              <Link href="/app/apply" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                Apply here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
