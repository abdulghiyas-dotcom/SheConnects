"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { NativeSelect } from "@/components/ui/input"
import { Callout } from "@/components/ui/callout"
import { Field, FormError } from "@/components/ui/field"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"
import { FileUpload, type UploadedFile } from "@/components/features/file-upload"

const DOC_TYPES = [
  { value: "passport",          label: "Passport" },
  { value: "national_id",       label: "National ID card" },
  { value: "residence_permit",  label: "Residence permit" },
  { value: "other",             label: "Other government ID" },
]

export function IdentityForm({ r2Configured }: { r2Configured: boolean }) {
  const router = useRouter()
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [docType, setDocType] = useState("passport")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleContinue() {
    if (!file) {
      router.push("/app/apply/voice")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/apply/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: file.fileId, docType, key: file.filename }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/voice")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <WizardShell
      currentStep={7}
      title="Verification"
      subtitle="We verify your identity to build trust with clients. Your documents are never shared."
    >
      <div className="space-y-6">
        <Callout tone="emerald" icon={ShieldCheck} title="Your documents are kept private">
          Identity documents are stored encrypted and only accessed by SheConnects staff during
          the review process. They are never shown to clients or visible on your profile.
        </Callout>

        {!file && (
          <div className="space-y-4">
            <Field label="Document type" htmlFor="docType">
              <NativeSelect id="docType" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </NativeSelect>
            </Field>

            <FileUpload
              category="identity"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              maxSizeMb={10}
              label="Upload your identity document"
              hint="JPG, PNG, or PDF · Max 10MB · Stored encrypted"
              r2Configured={r2Configured}
              onUpload={(f) => setFile(f)}
              uploadedFiles={[]}
            />
          </div>
        )}

        {file && (
          <FileUpload
            category="identity"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            maxSizeMb={10}
            label="Document uploaded"
            r2Configured={r2Configured}
            onUpload={(f) => setFile(f)}
            onRemove={() => setFile(null)}
            uploadedFiles={[file]}
          />
        )}

        <FormError>{error}</FormError>

        <WizardActions>
          <Button variant="ghost" onClick={() => router.push("/app/apply/portfolio")}>
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
