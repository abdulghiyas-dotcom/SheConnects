"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WizardShell } from "@/components/features/application-wizard"
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
        <div className="rounded-lg bg-trust-50 border border-trust-200 p-4 text-sm text-trust-800">
          <p className="font-medium mb-1">Your documents are kept private</p>
          <p className="text-trust-700">
            Identity documents are stored encrypted and only accessed by SheConnects staff during
            the review process. They are never shown to clients or visible on your profile.
          </p>
        </div>

        {!file && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Document type</Label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/portfolio")}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={saving}>
            {saving ? "Saving…" : file ? "Save & continue" : "Skip for now"}
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
