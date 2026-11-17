import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { callLLM } from "@/lib/ai/llm"

const VALID_TRACKS = ["PROGRAMMING", "CREATIVE_DESIGN", "TRANSLATION", "RESEARCH_DATA"]

const SYSTEM_PROMPT = `You are a project classifier for SheConnects, a platform connecting female freelancers with clients.

Classify the project brief into exactly one track:
- PROGRAMMING: software development, web/app development, APIs, automation, databases
- CREATIVE_DESIGN: graphic design, UI/UX, branding, illustrations, video, photography
- TRANSLATION: translation, localization, proofreading, copywriting, multilingual content
- RESEARCH_DATA: market research, data analysis, surveys, reports, academic research

Respond with a JSON object only — no markdown, no extra text:
{"track":"PROGRAMMING|CREATIVE_DESIGN|TRANSLATION|RESEARCH_DATA","confidence":0.9,"estimatedHours":20,"summary":"One sentence describing the project scope."}`

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({ where: { email: authUser.email } })
    if (!dbUser || dbUser.role !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description } = await req.json() as { title?: string; description?: string }
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const raw = await callLLM([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Title: ${title.trim()}\n\nDescription: ${description.trim()}` },
    ], { fast: true })

    let parsed: { track: string; confidence: number; estimatedHours: number; summary: string }
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch?.[0] ?? raw)
    } catch {
      return NextResponse.json({ error: "AI response could not be parsed. Try again." }, { status: 502 })
    }

    if (!VALID_TRACKS.includes(parsed.track)) {
      parsed.track = "PROGRAMMING"
    }
    parsed.confidence = Math.min(1, Math.max(0, Number(parsed.confidence) || 0.5))
    parsed.estimatedHours = Math.max(1, Math.round(Number(parsed.estimatedHours) || 10))
    parsed.summary = String(parsed.summary ?? "").slice(0, 300)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("POST /api/brief/analyze error:", err)
    return NextResponse.json({ error: "Analysis failed. Try again." }, { status: 500 })
  }
}
