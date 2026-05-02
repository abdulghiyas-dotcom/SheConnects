import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

function toSlug(alias: string): string {
  return alias
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

/** GET /api/freelancer/alias?slug=fatima-a — check availability */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")?.trim()

  if (!slug || slug.length < 2) {
    return NextResponse.json({ available: false, reason: "Too short" })
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const dbUser = await prismaAdmin.user.findUnique({
    where: { email: authUser.email },
    include: { freelancer: { select: { aliasSlug: true } } },
  })

  // If slug is already theirs, it's "available"
  if (dbUser?.freelancer?.aliasSlug === slug) {
    return NextResponse.json({ available: true, yours: true })
  }

  const existing = await prismaAdmin.freelancer.findUnique({
    where: { aliasSlug: slug },
    select: { id: true },
  })

  return NextResponse.json({ available: !existing })
}

/** POST /api/freelancer/alias — update alias + slug */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { alias } = body as { alias: string }

    const trimmed = alias?.trim()
    if (!trimmed || trimmed.length < 2 || trimmed.length > 40) {
      return NextResponse.json({ error: "Alias must be 2–40 characters" }, { status: 400 })
    }

    const slug = toSlug(trimmed)
    if (!slug || slug.length < 2) {
      return NextResponse.json({ error: "Alias produces an invalid URL slug" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true, status: true, aliasSlug: true } } },
    })

    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    if (dbUser.freelancer.status !== "ACTIVE") {
      return NextResponse.json({ error: "Alias can only be changed when your account is active" }, { status: 403 })
    }

    // Check slug uniqueness (unless it's already theirs)
    if (dbUser.freelancer.aliasSlug !== slug) {
      const conflict = await prismaAdmin.freelancer.findUnique({
        where: { aliasSlug: slug },
        select: { id: true },
      })
      if (conflict) {
        return NextResponse.json({ error: "This alias is already taken. Please try a different one." }, { status: 409 })
      }
    }

    await prismaAdmin.freelancer.update({
      where: { id: dbUser.freelancer.id },
      data: { alias: trimmed, aliasSlug: slug },
    })

    return NextResponse.json({ ok: true, alias: trimmed, slug })
  } catch (err) {
    console.error("freelancer/alias error:", err)
    return NextResponse.json({ error: "Failed to save alias" }, { status: 500 })
  }
}
