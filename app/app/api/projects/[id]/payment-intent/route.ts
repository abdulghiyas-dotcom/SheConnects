import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth/supabase-server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { createPaymentIntent, isStripeConfigured } from "@/lib/services/stripe"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await prismaAdmin.user.findUnique({
      where: { email: authUser.email },
      include: { client: { select: { id: true } } },
    })
    if (!dbUser?.client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

    const project = await prismaAdmin.project.findUnique({
      where: { id: params.id, clientId: dbUser.client.id },
      include: { payment: true },
    })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    if (!project.payment) return NextResponse.json({ error: "No payment record" }, { status: 404 })

    if (project.payment.status === "SUCCEEDED") {
      return NextResponse.json({ error: "Already paid" }, { status: 409 })
    }

    if (project.payment.stripePaymentIntentId) {
      const Stripe = await import("stripe")
      const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!)
      const pi = await stripe.paymentIntents.retrieve(project.payment.stripePaymentIntentId)
      return NextResponse.json({ clientSecret: pi.client_secret })
    }

    const pi = await createPaymentIntent(project.payment.totalCents, project.payment.currency, {
      projectId: project.id,
      paymentId: project.payment.id,
    })

    await prismaAdmin.payment.update({
      where: { id: project.payment.id },
      data: { stripePaymentIntentId: pi.id, status: "PROCESSING" },
    })

    return NextResponse.json({ clientSecret: pi.client_secret })
  } catch (err) {
    console.error("POST /api/projects/[id]/payment-intent error:", err)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
