import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"

const VALID_DOC_TYPES = ["passport", "national_id", "residence_permit", "other"] as const

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { fileId, docType, key } = body as {
      fileId: string
      docType: string
      key: string
    }

    if (!fileId || !key) return NextResponse.json({ error: "fileId and key are required" }, { status: 400 })
    if (!VALID_DOC_TYPES.includes(docType as never)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }

    const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    await prismaAdmin.userIdentity.upsert({
      where: { userId: dbUser.id },
      update: { idDocumentUrl: key, idDocumentType: docType },
      create: {
        userId: dbUser.id,
        legalFirstName: "",
        legalLastName: "",
        idDocumentUrl: key,
        idDocumentType: docType,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("apply/identity error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
