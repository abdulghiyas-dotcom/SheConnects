import { NextRequest, NextResponse } from "next/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { constructWebhookEvent, isStripeConfigured } from "@/lib/services/stripe"
import { emailPaymentConfirmedClient, emailPaymentConfirmedFreelancer } from "@/lib/services/email"

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 })

  let event
  try {
    event = constructWebhookEvent(payload, sig)
  } catch (err) {
    console.error("Stripe webhook signature error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object
      await prismaAdmin.payment.updateMany({
        where: { stripePaymentIntentId: pi.id },
        data: {
          status: "SUCCEEDED",
          stripeChargeId: (pi as { latest_charge?: string }).latest_charge ?? null,
          paidAt: new Date(),
        },
      })
      const payment = await prismaAdmin.payment.findFirst({
        where: { stripePaymentIntentId: pi.id },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              client: { select: { user: { select: { email: true } } } },
              freelancer: { select: { alias: true, user: { select: { email: true } } } },
            },
          },
        },
      })
      if (payment?.project) {
        const { project } = payment
        emailPaymentConfirmedClient(project.client.user.email, project.title, project.id)
        emailPaymentConfirmedFreelancer(project.freelancer.user.email, project.freelancer.alias ?? "there", project.title, project.id)
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object
      await prismaAdmin.payment.updateMany({
        where: { stripePaymentIntentId: pi.id },
        data: {
          status: "FAILED",
          failureReason: (pi as { last_payment_error?: { message?: string } }).last_payment_error?.message ?? null,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Stripe webhook handler error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
