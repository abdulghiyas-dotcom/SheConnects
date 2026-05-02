import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { emailMilestoneSubmitted, emailMilestoneApproved, emailMilestoneRevision } from "@/lib/services/email"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { action } = body as { action: "start" | "submit" | "approve" | "revision" }

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: {
        freelancer: { select: { id: true } },
        client: { select: { id: true } },
      },
    })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const project = await prismaAdmin.project.findUnique({
      where: { id: params.id },
      include: {
        milestones: { orderBy: { orderIndex: "asc" } },
        client: { select: { organizationName: true, user: { select: { email: true } } } },
        freelancer: { select: { alias: true, user: { select: { email: true } } } },
      },
    })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    const milestone = project.milestones.find((m) => m.id === params.milestoneId)
    if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 })

    const isFreelancer = dbUser.freelancer?.id === project.freelancerId
    const isClient = dbUser.client?.id === project.clientId

    if (action === "start") {
      if (!isFreelancer) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      if (milestone.status !== "PENDING") {
        return NextResponse.json({ error: "Milestone already started" }, { status: 409 })
      }
      await prismaAdmin.$transaction([
        prismaAdmin.milestone.update({
          where: { id: milestone.id },
          data: { status: "IN_PROGRESS", startedAt: new Date() },
        }),
        ...(project.status === "AWAITING_KICKOFF" ? [
          prismaAdmin.project.update({
            where: { id: project.id },
            data: { status: "IN_PROGRESS", startedAt: new Date() },
          }),
        ] : []),
      ])
      return NextResponse.json({ ok: true })
    }

    if (action === "submit") {
      if (!isFreelancer) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      if (!["IN_PROGRESS", "REVISION_REQUESTED"].includes(milestone.status)) {
        return NextResponse.json({ error: "Milestone cannot be submitted in its current state" }, { status: 409 })
      }
      await prismaAdmin.milestone.update({
        where: { id: milestone.id },
        data: { status: "SUBMITTED", submittedAt: new Date() },
      })
      emailMilestoneSubmitted(project.client.user.email, project.client.organizationName ?? "", project.title, milestone.title, project.id)
      return NextResponse.json({ ok: true })
    }

    if (action === "approve") {
      if (!isClient) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      if (milestone.status !== "SUBMITTED") {
        return NextResponse.json({ error: "Milestone is not submitted" }, { status: 409 })
      }
      await prismaAdmin.$transaction(async (tx) => {
        await tx.milestone.update({
          where: { id: milestone.id },
          data: { status: "APPROVED", approvedAt: new Date() },
        })
        const allApproved = project.milestones
          .filter((m) => m.id !== milestone.id)
          .every((m) => m.status === "APPROVED")
        if (allApproved) {
          await tx.project.update({
            where: { id: project.id },
            data: { status: "COMPLETED", completedAt: new Date() },
          })
          await tx.payout.create({
            data: {
              freelancerId: project.freelancerId,
              projectId: project.id,
              amountCents: project.freelancerPriceCents,
              currency: project.currency,
              status: "SCHEDULED",
            },
          })
        }
      })
      emailMilestoneApproved(project.freelancer.user.email, project.freelancer.alias ?? "there", project.title, milestone.title, project.id)
      return NextResponse.json({ ok: true })
    }

    if (action === "revision") {
      if (!isClient) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      if (milestone.status !== "SUBMITTED") {
        return NextResponse.json({ error: "Milestone is not submitted" }, { status: 409 })
      }
      await prismaAdmin.milestone.update({
        where: { id: milestone.id },
        data: { status: "REVISION_REQUESTED" },
      })
      emailMilestoneRevision(project.freelancer.user.email, project.freelancer.alias ?? "there", project.title, milestone.title, project.id)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/projects/[id]/milestones/[milestoneId] error:", err)
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 })
  }
}
