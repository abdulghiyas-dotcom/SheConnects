"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/callout"
import { FormError } from "@/components/ui/field"
import { formatEur } from "@/lib/utils/pricing"

function CheckoutForm({ projectId, totalCents }: { projectId: string; totalCents: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setError("")
    setLoading(true)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/app/projects/${projectId}?payment=success`,
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      <FormError>{error}</FormError>
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing…" : `Pay ${formatEur(totalCents)}`}
      </Button>
    </form>
  )
}

interface Props {
  projectId: string
  totalCents: number
  publishableKey: string
  stripeConfigured: boolean
}

export function PaymentForm({ projectId, totalCents, publishableKey, stripeConfigured }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState("")
  const stripePromise = stripeConfigured ? loadStripe(publishableKey) : null

  useEffect(() => {
    if (!stripeConfigured) return
    fetch(`/api/projects/${projectId}/payment-intent`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setFetchError(data.error ?? "Could not initialise payment")
      })
      .catch(() => setFetchError("Could not initialise payment"))
  }, [projectId, stripeConfigured])

  if (!stripeConfigured) {
    return (
      <Callout tone="amber" title="Payments are not active yet">
        <span className="text-xs">
          Add <code className="rounded bg-amber-100 px-1 font-mono text-[11px]">STRIPE_SECRET_KEY</code> and{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-[11px]">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to
          your environment to enable this.
        </span>
      </Callout>
    )
  }

  if (fetchError) {
    return <FormError>{fetchError}</FormError>
  }

  if (!clientSecret) {
    return <p className="py-6 text-center text-sm text-slate-400">Loading payment form…</p>
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        // Match the Stripe fields to the platform inputs
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#4f46e5",
            colorText: "#0f172a",
            colorDanger: "#dc2626",
            borderRadius: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <CheckoutForm projectId={projectId} totalCents={totalCents} />
    </Elements>
  )
}
