import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create the User + Freelancer records in our database
    // Temporary alias and track — the full application wizard fills these in
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
            track: "TRANSLATION", // default, changed in application wizard
            status: "APPLIED",
          },
        },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("create-freelancer error:", err)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
