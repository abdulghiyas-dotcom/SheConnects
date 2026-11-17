import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { isR2Configured, getPresignedUploadUrl, r2Bucket } from "@/lib/services/r2"

type UploadCategory = "portfolio" | "identity" | "voice"

const ALLOWED_TYPES: Record<UploadCategory, string[]> = {
  portfolio: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
  identity:  ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  voice:     ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/ogg", "video/webm"],
}

const MAX_BYTES: Record<UploadCategory, number> = {
  portfolio: 20 * 1024 * 1024,
  identity:  10 * 1024 * 1024,
  voice:     50 * 1024 * 1024,
}

export async function POST(req: NextRequest) {
  if (!isR2Configured) {
    return NextResponse.json(
      { error: "File storage is not yet configured. Contact the SheConnects team." },
      { status: 503 }
    )
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const { filename, contentType, category, sizeBytes } = body as {
    filename: string
    contentType: string
    category: UploadCategory
    sizeBytes: number
  }

  if (!Object.keys(ALLOWED_TYPES).includes(category)) {
    return NextResponse.json({ error: "Invalid upload category" }, { status: 400 })
  }

  if (!ALLOWED_TYPES[category].includes(contentType)) {
    return NextResponse.json(
      { error: `File type "${contentType}" is not allowed for ${category} uploads` },
      { status: 400 }
    )
  }

  if (sizeBytes > MAX_BYTES[category]) {
    return NextResponse.json(
      { error: `File too large — max ${MAX_BYTES[category] / 1024 / 1024}MB for ${category}` },
      { status: 400 }
    )
  }

  const safeFilename = filename.replace(/[^a-z0-9._-]/gi, "_").toLowerCase()
  const key = `${category}/${dbUser.id}/${Date.now()}-${safeFilename}`

  const fileRecord = await prismaAdmin.file.create({
    data: {
      uploadedById: dbUser.id,
      bucket: r2Bucket!,
      key,
      originalName: filename,
      mimeType: contentType,
      sizeBytes,
      category,
      isPublic: false,
    },
  })

  const uploadUrl = await getPresignedUploadUrl(key, contentType)

  return NextResponse.json({ uploadUrl, fileId: fileRecord.id, key })
}
