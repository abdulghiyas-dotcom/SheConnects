import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AliasForm } from "./alias-form"

function buildSuggestions(firstName: string, lastName: string): string[] {
  const first = firstName.trim()
  const last = lastName.trim()
  if (!first) return []

  const lastInitial = last ? `${last[0].toUpperCase()}.` : ""
  const firstInitial = `${first[0].toUpperCase()}.`

  const candidates = [
    lastInitial ? `${first} ${lastInitial}` : first,       // "Fatima A."
    last ? `${firstInitial} ${last}` : firstInitial,        // "F. Ahmadi"
    first,                                                   // "Fatima"
  ]

  // Deduplicate and return up to 3
  const seen = new Set<string>()
  return candidates.filter((c) => { if (seen.has(c)) return false; seen.add(c); return true }).slice(0, 3)
}

export default async function AliasPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { status: true, alias: true },
  })

  if (!freelancer || freelancer.status !== "ACTIVE") {
    redirect("/app/freelancer/dashboard")
  }

  // Load real name from UserIdentity — stays server-side, never sent to client as-is
  const identity = await prismaAdmin.userIdentity.findUnique({
    where: { userId: user.id },
    select: { legalFirstName: true, legalLastName: true },
  })

  const suggestions = identity
    ? buildSuggestions(identity.legalFirstName, identity.legalLastName)
    : []

  return (
    <AliasForm
      currentAlias={freelancer.alias}
      suggestions={suggestions}
    />
  )
}
