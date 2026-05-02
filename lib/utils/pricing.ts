const COMMISSION_RATE = 0.20 // 20% platform fee

const EU_COUNTRIES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR",
  "GR","HR","HU","IE","LT","LU","LV","MT","NL","PL","PT",
  "RO","SE","SI","SK",
])

export function getVatInfo(billingCountry: string | null): {
  vatRate: number
  vatRegime: "IT_DOMESTIC" | "EU_B2B" | "EU_B2C" | "EXTRA_EU" | "NON_TAXABLE"
} {
  const country = billingCountry?.toUpperCase() ?? ""
  if (country === "IT") return { vatRate: 0.22, vatRegime: "IT_DOMESTIC" }
  if (EU_COUNTRIES.has(country)) return { vatRate: 0, vatRegime: "EU_B2B" }
  return { vatRate: 0, vatRegime: "EXTRA_EU" }
}

export function calculatePricing(freelancerPriceCents: number, vatRate: number) {
  const commissionCents = Math.round(freelancerPriceCents * COMMISSION_RATE)
  const subtotalCents = freelancerPriceCents + commissionCents
  const vatCents = Math.round(subtotalCents * vatRate)
  const totalCents = subtotalCents + vatCents

  return { freelancerPriceCents, commissionCents, subtotalCents, vatCents, totalCents }
}

export function formatEur(cents: number): string {
  return `€${(cents / 100).toLocaleString("en-EU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
