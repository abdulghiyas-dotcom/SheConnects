"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
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
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Payments are not active yet. Add <code className="text-xs">STRIPE_SECRET_KEY</code> and{" "}
        <code className="text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your environment to enable this.
      </div>
    )
  }

  if (fetchError) {
    return <p className="text-sm text-destructive">{fetchError}</p>
  }

  if (!clientSecret) {
    return <p className="text-sm text-muted-foreground">Loading payment form…</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm projectId={projectId} totalCents={totalCents} />
    </Elements>
  )
}
