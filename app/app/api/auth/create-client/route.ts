import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgName, orgType } = await request.json()

    // Create the User + Client records in our database
    await prismaAdmin.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        role: "CLIENT",
        status: "ACTIVE",
        client: {
          create: {
            organizationName: orgName ?? "Unknown",
            organizationType: orgType ?? "other",
          },
        },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("create-client error:", err)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
