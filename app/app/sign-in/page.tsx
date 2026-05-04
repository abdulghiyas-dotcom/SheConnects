"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, User2, ArrowLeft, ArrowRight } from "lucide-react"

type Role = "client" | "freelancer" | null

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? ""
  const roleParam = searchParams.get("role") as Role

  const [role, setRole] = useState<Role>(roleParam)
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
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError("Invalid email or password."); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("Something went wrong."); return }
      const res = await fetch("/api/auth/me")
      const profile = await res.json()
      if (redirectTo) router.push(redirectTo)
      else if (profile?.role === "FREELANCER") router.push("/app/freelancer/dashboard")
      else if (profile?.role === "ADMIN" || profile?.role === "TEAM") router.push("/app/admin")
      else router.push("/app/client/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Role picker ── */
  if (!role) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">SheConnects</span>
          </Link>
          <p className="text-sm text-slate-500">
            No account?{" "}
            <Link href="/app/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign up</Link>
          </p>
        </div>

        {/* Picker */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
          {/* Subtle tint */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, #EEF2FF 0%, transparent 70%)" }} />

          <div className="relative text-center mb-12">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2 text-base text-slate-500">How do you want to sign in?</p>
          </div>

          <div className="relative grid w-full max-w-lg gap-4 sm:grid-cols-2">
            {/* Org card */}
            <button
              type="button"
              onClick={() => setRole("client")}
              className="group flex flex-col items-center gap-5 rounded-2xl border-2 border-slate-200 bg-white px-6 py-8 text-center shadow-sm transition-all hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                <Building2 size={28} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">I represent an organisation</p>
                <p className="mt-1.5 text-xs text-slate-400">NGOs, SMEs, social enterprises</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white">
                Sign in as organisation <ArrowRight size={11} />
              </span>
            </button>

            {/* Freelancer card */}
            <button
              type="button"
              onClick={() => setRole("freelancer")}
              className="group flex flex-col items-center gap-5 rounded-2xl border-2 border-slate-200 bg-white px-6 py-8 text-center shadow-sm transition-all hover:border-purple-400 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 group-hover:bg-purple-100 transition-colors">
                <User2 size={28} className="text-purple-600" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">I am an Afghan woman</p>
                <p className="mt-1.5 text-xs text-slate-400">Sign in to your freelancer account</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold text-white">
                Sign in as freelancer <ArrowRight size={11} />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Sign-in form ── */
  const isOrg = role === "client"

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <button type="button" onClick={() => setRole(null)} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/icon.png" alt="SheConnects" width={26} height={26} className="rounded-full" />
          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">SheConnects</span>
        </Link>
        <p className="text-sm text-slate-500">
          <Link href="/app/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-700">Create account</Link>
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, #EEF2FF 0%, transparent 70%)" }} />

        <div className="relative w-full max-w-sm">
          {/* Role badge */}
          <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${isOrg ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-purple-50 text-purple-600 border border-purple-100"}`}>
            {isOrg ? <Building2 size={12} /> : <User2 size={12} />}
            {isOrg ? "Organisation account" : "Freelancer account"}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" required autoComplete="email" className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            <Button type="submit" className={`w-full h-11 rounded-xl font-bold border-0 ${isOrg ? "bg-indigo-600 hover:bg-indigo-700" : "bg-purple-600 hover:bg-purple-700"}`} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
            <p>Don&apos;t have an account?{" "}<Link href="/app/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign up</Link></p>
            <p><Link href="/app/apply" className="font-semibold text-indigo-600 hover:text-indigo-700">Apply as a freelancer →</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
