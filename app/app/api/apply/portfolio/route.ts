import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { files } = body as { files: { fileId: string; filename: string }[] }

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { freelancer: { select: { id: true } } },
    })
    if (!dbUser?.freelancer) return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    const freelancerId = dbUser.freelancer.id

    // Create one PortfolioItem per uploaded file
    for (let i = 0; i < files.length; i++) {
      const { fileId, filename } = files[i]
      const title = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")

      const item = await prismaAdmin.portfolioItem.create({
        data: {
          freelancerId,
          title,
          description: "",
          displayOrder: i,
          isAnonymised: true,
          clientNameRedacted: true,
        },
      })

      await prismaAdmin.portfolioFile.create({
        data: {
          portfolioItemId: item.id,
          fileId,
          displayOrder: 0,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/portfolio error:", err)
    return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 })
  }
}
