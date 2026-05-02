"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"
import { FileUpload, type UploadedFile } from "@/components/features/file-upload"

export function PortfolioForm({ r2Configured }: { r2Configured: boolean }) {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleContinue() {
    if (files.length === 0) {
      router.push("/app/apply/identity")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/apply/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: files.map((f) => ({ fileId: f.fileId, filename: f.filename })) }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/identity")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <WizardShell
      currentStep={6}
      title="Portfolio"
      subtitle="Share examples of your past work. Up to 3 files — images or PDFs."
    >
      <div className="space-y-6">
        <FileUpload
          category="portfolio"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          maxSizeMb={20}
          label="Drop files here or click to upload"
          hint="JPG, PNG, WebP, or PDF · Up to 3 files · 20MB each"
          multiple
          r2Configured={r2Configured}
          onUpload={(f) => setFiles((prev) => prev.length < 3 ? [...prev, f] : prev)}
          onRemove={(id) => setFiles((prev) => prev.filter((f) => f.fileId !== id))}
          uploadedFiles={files}
        />

        <p className="text-sm text-muted-foreground">
          No portfolio yet? That's fine — skip this step and add work samples later from your dashboard.
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => router.push("/app/apply/experience")}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={saving}>
            {saving ? "Saving…" : files.length > 0 ? "Save & continue" : "Skip for now"}
          </Button>
        </div>
      </div>
    </WizardShell>
  )
}
