"use client"

import { useCallback, useRef, useState } from "react"
import { UploadCloud, File, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"

export interface UploadedFile {
  fileId: string
  filename: string
  sizeBytes: number
}

interface FileUploadProps {
  category: "portfolio" | "identity" | "voice"
  accept: string
  maxSizeMb: number
  label: string
  hint?: string
  multiple?: boolean
  onUpload: (file: UploadedFile) => void
  onRemove?: (fileId: string) => void
  uploadedFiles?: UploadedFile[]
  r2Configured?: boolean
}

export function FileUpload({
  category,
  accept,
  maxSizeMb,
  label,
  hint,
  multiple = false,
  onUpload,
  onRemove,
  uploadedFiles = [],
  r2Configured = true,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setError("")

      for (const file of Array.from(files)) {
        if (file.size > maxSizeMb * 1024 * 1024) {
          setError(`"${file.name}" is too large — max ${maxSizeMb}MB.`)
          continue
        }

        setUploading(file.name)

        try {
          // 1. Get presigned URL from our server
          const presignRes = await fetch("/api/upload/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              category,
              sizeBytes: file.size,
            }),
          })

          if (!presignRes.ok) {
            const data = await presignRes.json()
            setError(data.error ?? "Could not start upload. Try again.")
            continue
          }

          const { uploadUrl, fileId } = await presignRes.json()

          // 2. PUT the file directly to R2
          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          })

          if (!uploadRes.ok) {
            setError(`Upload failed for "${file.name}". Please try again.`)
            continue
          }

          onUpload({ fileId, filename: file.name, sizeBytes: file.size })
        } catch {
          setError(`Upload failed for "${file.name}". Check your connection and try again.`)
        } finally {
          setUploading(null)
        }
      }
    },
    [category, maxSizeMb, onUpload]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  if (!r2Configured) {
    return (
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3 items-start">
          <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">File uploads not yet configured</p>
            <p className="text-xs text-amber-700 mt-1">
              R2 storage keys are missing from the server. Add{" "}
              <code className="bg-amber-100 px-1 rounded">R2_ACCOUNT_ID</code>,{" "}
              <code className="bg-amber-100 px-1 rounded">R2_ACCESS_KEY_ID</code>,{" "}
              <code className="bg-amber-100 px-1 rounded">R2_SECRET_ACCESS_KEY</code>, and{" "}
              <code className="bg-amber-100 px-1 rounded">R2_BUCKET_NAME</code> to .env.local to enable uploads.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          dragging ? "border-brand-400 bg-brand-50" : "border-border hover:border-brand-300 bg-secondary/30",
          uploading && "cursor-wait opacity-70"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadCloud className="mx-auto mb-2 text-muted-foreground" size={28} />
        {uploading ? (
          <p className="text-sm text-muted-foreground">Uploading {uploading}…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop or click to select · Max {maxSizeMb}MB
            </p>
            {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((f) => (
            <li
              key={f.fileId}
              className="flex items-center gap-3 rounded-lg border border-trust-200 bg-trust-50 px-3 py-2"
            >
              <CheckCircle2 className="text-trust-500 shrink-0" size={16} />
              <File className="text-muted-foreground shrink-0" size={14} />
              <span className="text-sm text-foreground truncate flex-1">{f.filename}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {(f.sizeBytes / 1024 / 1024).toFixed(1)}MB
              </span>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(f.fileId) }}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
