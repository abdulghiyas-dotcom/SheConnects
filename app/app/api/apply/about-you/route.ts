import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json()
    const { legalFirstName, legalLastName, dateOfBirth, countryOfResidence, cityOfResidence } = body

    if (!legalFirstName || !legalLastName) {
      return NextResponse.json({ error: "First and last name are required" }, { status: 400 })
    }

    await prismaAdmin.userIdentity.upsert({
      where: { userId: dbUser.id },
      update: {
        legalFirstName: legalFirstName.trim(),
        legalLastName: legalLastName.trim(),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        countryOfResidence: countryOfResidence || null,
        cityOfResidence: cityOfResidence || null,
      },
      create: {
        userId: dbUser.id,
        legalFirstName: legalFirstName.trim(),
        legalLastName: legalLastName.trim(),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        countryOfResidence: countryOfResidence || null,
        cityOfResidence: cityOfResidence || null,
      },
    })

    // Mirror city/country to the public-facing freelancer profile
    if (dbUser.role === "FREELANCER") {
      await prismaAdmin.freelancer.update({
        where: { userId: dbUser.id },
        data: {
          displayCity: cityOfResidence || null,
          displayCountry: countryOfResidence || null,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/about-you error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
