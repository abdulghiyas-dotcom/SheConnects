"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, User2, ArrowLeft } from "lucide-react"

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

      if (authError) {
        setError("Invalid email or password.")
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("Something went wrong."); return }

      const res = await fetch("/api/auth/me")
      const profile = await res.json()

      if (redirectTo) {
        router.push(redirectTo)
      } else if (profile?.role === "FREELANCER") {
        router.push("/app/freelancer/dashboard")
      } else if (profile?.role === "ADMIN" || profile?.role === "TEAM") {
        router.push("/app/admin")
      } else {
        router.push("/app/client/dashboard")
      }

      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
  const labelClass = "text-sm font-medium text-white/60"

  /* ── Role picker (no ?role= set) ── */
  if (!role) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
        style={{ background: "#080810" }}
      >
        {/* Logo */}
        <Link href="/" className="mb-12 flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SheConnects" width={32} height={32} className="rounded-full" />
          <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">SheConnects</span>
        </Link>

        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-white/40">Choose how you want to sign in</p>
        </div>

        {/* Two cards */}
        <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole("client")}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-white/8 p-8 text-center transition-all hover:border-indigo-500/40 hover:-translate-y-0.5"
            style={{ background: "#0F0F1A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(79,70,229,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Building2 size={24} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white">I represent an organisation</p>
              <p className="mt-1.5 text-xs text-white/35">NGOs, SMEs, social enterprises</p>
            </div>
            <span className="mt-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              Sign in as organisation
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("freelancer")}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-white/8 p-8 text-center transition-all hover:border-purple-500/40 hover:-translate-y-0.5"
            style={{ background: "#0F0F1A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(124,58,237,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <User2 size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white">I am an Afghan woman</p>
              <p className="mt-1.5 text-xs text-white/35">Join our network of freelancers</p>
            </div>
            <span className="mt-auto rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              Sign in as freelancer
            </span>
          </button>
        </div>

        <p className="mt-8 text-sm text-white/30">
          Don&apos;t have an account?{" "}
          <Link href="/app/sign-up" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    )
  }

  /* ── Sign-in form (role is set) ── */
  const isOrg = role === "client"

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ background: "#080810" }}
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => setRole(null)}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-2.5 group">
        <Image src="/icon.png" alt="SheConnects" width={30} height={30} className="rounded-full" />
        <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">SheConnects</span>
      </Link>

      <div className="w-full max-w-sm">
        {/* Role badge */}
        <div className="mb-7 flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isOrg ? "bg-indigo-500/15" : "bg-purple-500/15"}`}>
            {isOrg ? <Building2 size={14} className="text-indigo-400" /> : <User2 size={14} className="text-purple-400" />}
          </div>
          <span className={`text-xs font-semibold ${isOrg ? "text-indigo-400" : "text-purple-400"}`}>
            {isOrg ? "Organisation account" : "Freelancer account"}
          </span>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className={labelClass}>Email address</Label>
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
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold border-0 hover:-translate-y-0.5 transition-all"
            style={{ boxShadow: "0 0 20px rgba(79,70,229,0.35)" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-white/35">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/app/sign-up" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/app/apply" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Apply as a freelancer →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
