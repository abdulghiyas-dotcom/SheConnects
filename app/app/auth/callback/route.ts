import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

// Handles Supabase magic link / email confirmation clicks.
// Supabase redirects here with ?code=xxx after the user clicks the email link.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/app/client/dashboard"

  if (!code) {
    return NextResponse.redirect(`${origin}/app/sign-in?error=missing_code`)
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/app/sign-in?error=verification_failed`)
  }

  const user = data.user
  const role = (user.user_metadata?.role as string | undefined) ?? "CLIENT"

  try {
    if (role === "FREELANCER") {
      const tempAlias = `Applicant-${Math.random().toString(36).slice(2, 7)}`
      const tempSlug = `applicant-${Date.now()}`
      await prismaAdmin.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          role: "FREELANCER",
          status: "PENDING",
          freelancer: {
            create: {
              alias: tempAlias,
              aliasSlug: tempSlug,
              track: "TRANSLATION",
              status: "APPLIED",
            },
          },
        },
      })
    } else {
      const orgName = (user.user_metadata?.organizationName as string | undefined) ?? "Unknown"
      const orgType = (user.user_metadata?.organizationType as string | undefined) ?? "other"
      await prismaAdmin.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          role: "CLIENT",
          status: "ACTIVE",
          client: {
            create: {
              organizationName: orgName,
              organizationType: orgType,
            },
          },
        },
      })
    }
  } catch (err) {
    console.error("auth/callback profile creation error:", err)
    // Profile creation failed but auth succeeded — redirect to sign-in so they can retry
    return NextResponse.redirect(`${origin}/app/sign-in?error=profile_failed`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
