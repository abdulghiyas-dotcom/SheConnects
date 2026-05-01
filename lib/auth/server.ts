import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase-server"
import { prisma } from "@/lib/db/client"
import type { UserRole } from "@prisma/client"

// Returns the current logged-in user from the database, or null if not logged in
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) return null

    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        locale: true,
        freelancer: { select: { id: true, status: true, aliasSlug: true } },
        client: { select: { id: true } },
      },
    })

    return user
  } catch {
    return null
  }
}

// Redirects to sign-in if user is not logged in
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect("/app/sign-in")
  return user
}

// Redirects if user doesn't have the required role
export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth()
  const allowed = Array.isArray(role) ? role : [role]

  if (!allowed.includes(user.role)) {
    redirect("/app/sign-in")
  }

  return user
}

// Dashboard redirect based on role — called after sign-in
export function getDashboardPath(role: UserRole, locale = "en"): string {
  switch (role) {
    case "FREELANCER":
      return "/app/freelancer/dashboard"
    case "CLIENT":
      return `/${locale}/app/client/dashboard`
    case "TEAM":
    case "ADMIN":
      return "/app/admin"
    default:
      return "/app/sign-in"
  }
}
