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
import { Building2, User2, ArrowLeft, ArrowRight } from "lucide-react"

const ROLES = [
  {
    role: "client" as const,
    icon: Building2,
    tone: "indigo" as const,
    title: "I represent an organisation",
    sub: "NGOs, SMEs, social enterprises",
    cta: "Sign in as organisation",
    hover: "hover:border-indigo-300",
    ctaColor: "text-indigo-600",
  },
  {
    role: "freelancer" as const,
    icon: User2,
    tone: "purple" as const,
    title: "I am an Afghan woman",
    sub: "Sign in to your freelancer account",
    cta: "Sign in as freelancer",
    hover: "hover:border-purple-300",
    ctaColor: "text-purple-600",
  },
]

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
      <AuthShell
        topRight={<>No account? <Link href="/app/sign-up" className={authLinkClass}>Sign up</Link></>}
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-base text-slate-500">How do you want to sign in?</p>
        </div>

        <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setRole(r.role)}
              className={`group flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${r.hover}`}
            >
              <IconTile icon={r.icon} tone={r.tone} size="lg" />
              <div>
                <p className="text-base font-black text-slate-900">{r.title}</p>
                <p className="mt-1.5 text-xs text-slate-500">{r.sub}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${r.ctaColor}`}>
                {r.cta}
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </AuthShell>
    )
  }

  /* ── Sign-in form ── */
  const isOrg = role === "client"

  return (
    <AuthShell
      topLeft={
        <button
          type="button"
          onClick={() => setRole(null)}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> Back
        </button>
      }
      topRight={<Link href="/app/sign-up" className={authLinkClass}>Create account</Link>}
    >
      <div className="w-full max-w-sm">
        <Badge tone={isOrg ? "indigo" : "purple"} eyebrow className="mb-6">
          {isOrg ? <Building2 size={11} /> : <User2 size={11} />}
          {isOrg ? "Organisation account" : "Freelancer account"}
        </Badge>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field label="Email address" htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" required autoComplete="email" />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>
          <FormError>{error}</FormError>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
          <p>Don&apos;t have an account?{" "}<Link href="/app/sign-up" className={authLinkClass}>Sign up</Link></p>
          <p><Link href="/app/apply" className={authLinkClass}>Apply as a freelancer →</Link></p>
        </div>
      </div>
    </AuthShell>
  )
}
