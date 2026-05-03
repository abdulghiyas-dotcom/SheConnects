"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Users, Globe } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? ""

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

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)" }}
      >
        {/* Background orbs */}
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
              Verified talent.<br />Real impact.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Connect with skilled Afghan women professionals — vetted, privacy-protected, and ready to work.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: "Every freelancer identity-verified" },
              { icon: Users,       text: "150+ women earning their income" },
              { icon: Globe,       text: "Clients across Europe & beyond" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={15} className="text-brand-300" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          <blockquote className="border-l-2 border-brand-400 pl-4">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "SheConnects gave me the chance to use my skills and support my family — while staying safe."
            </p>
            <p className="mt-2 text-xs text-slate-500">— Zahra M., Translation track</p>
          </blockquote>
        </div>

        <p className="relative z-10 text-xs text-slate-600">
          © {new Date().getFullYear()} SheConnects · GDPR compliant
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <Image src="/icon.png" alt="SheConnects" width={28} height={28} className="rounded-full" />
          <span className="font-semibold text-slate-900">SheConnects</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
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
                required
                autoComplete="current-password"
                className="h-11 rounded-xl border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-brand font-medium"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/app/sign-up" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                Sign up
              </Link>
            </p>
            <p>
              <Link href="/app/apply" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                Apply as a freelancer →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
