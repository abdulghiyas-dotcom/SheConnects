import { requireRole } from "@/lib/auth/server"
import { isR2Configured } from "@/lib/services/r2"
import { VoiceForm } from "./voice-form"

export default async function VoicePage() {
  await requireRole("FREELANCER")
  return <VoiceForm r2Configured={isR2Configured} />
}
