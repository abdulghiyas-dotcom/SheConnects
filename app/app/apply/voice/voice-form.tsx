"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { Callout } from "@/components/ui/callout"
import { FormError } from "@/components/ui/field"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"
import { FileUpload, type UploadedFile } from "@/components/features/file-upload"

export function VoiceForm({ r2Configured }: { r2Configured: boolean }) {
  const router = useRouter()
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleContinue() {
    if (!file) {
      router.push("/app/apply/review")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/apply/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.fileId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/review")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <WizardShell
      currentStep={8}
      title="Voice intro"
      subtitle="A 60-second voice message lets clients hear you before they hire you."
    >
      <div className="space-y-6">
        <FileUpload
          category="voice"
          accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg"
          maxSizeMb={50}
          label="Upload a voice recording (up to 60 seconds)"
          hint="MP3, M4A, WAV, or WebM · Max 50MB"
          r2Configured={r2Configured}
          onUpload={(f) => setFile(f)}
          onRemove={() => setFile(null)}
          uploadedFiles={file ? [file] : []}
        />

        <Callout tone="indigo" icon={Mic} title="Tips for a great voice intro">
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            <li>Introduce yourself and your professional background</li>
            <li>Mention your main languages and skills</li>
            <li>Say what kinds of projects you enjoy</li>
            <li>Speak in the language you&apos;d use with clients (English or Italian)</li>
          </ul>
        </Callout>

        <p className="text-sm leading-relaxed text-slate-500">
          Voice intros are optional but highly recommended — applicants with them receive significantly more
          enquiries.
        </p>

        <FormError>{error}</FormError>

        <WizardActions>
          <Button variant="ghost" onClick={() => router.push("/app/apply/identity")}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={saving}>
            {saving ? "Saving…" : file ? "Save & continue" : "Skip for now"}
          </Button>
        </WizardActions>
      </div>
    </WizardShell>
  )
}
