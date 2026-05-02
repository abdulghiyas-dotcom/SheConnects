import { requireRole } from "@/lib/auth/server"
import { isR2Configured } from "@/lib/services/r2"
import { IdentityForm } from "./identity-form"

export default async function IdentityPage() {
  await requireRole("FREELANCER")
  return <IdentityForm r2Configured={isR2Configured} />
}
