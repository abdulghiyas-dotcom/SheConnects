import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json(null, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, email: true, role: true, status: true },
    })

    return NextResponse.json(profile)
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
