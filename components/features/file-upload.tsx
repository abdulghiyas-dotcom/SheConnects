"use client"

import { useCallback, useRef, useState } from "react"
import { UploadCloud, File, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Callout } from "@/components/ui/callout"

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
    const code = "rounded bg-amber-100 px-1 font-mono text-[11px]"
    return (
      <Callout tone="amber" icon={AlertTriangle} title="File uploads not yet configured">
        <span className="text-xs">
          R2 storage keys are missing from the server. Add <code className={code}>R2_ACCOUNT_ID</code>,{" "}
          <code className={code}>R2_ACCESS_KEY_ID</code>, <code className={code}>R2_SECRET_ACCESS_KEY</code>, and{" "}
          <code className={code}>R2_BUCKET_NAME</code> to .env.local to enable uploads.
        </span>
      </Callout>
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
          "relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40",
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
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
          <UploadCloud className="text-indigo-600" size={20} />
        </div>
        {uploading ? (
          <p className="text-sm text-slate-500">Uploading {uploading}…</p>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-900">{label}</p>
            <p className="mt-1 text-xs text-slate-500">
              Drag & drop or click to select · Max {maxSizeMb}MB
            </p>
            {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
          </>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((f) => (
            <li
              key={f.fileId}
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5"
            >
              <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
              <File className="shrink-0 text-slate-400" size={14} />
              <span className="flex-1 truncate text-sm font-medium text-slate-800">{f.filename}</span>
              <span className="shrink-0 text-xs tabular-nums text-slate-500">
                {(f.sizeBytes / 1024 / 1024).toFixed(1)}MB
              </span>
              {onRemove && (
                <button
                  type="button"
                  aria-label={`Remove ${f.filename}`}
                  onClick={(e) => { e.stopPropagation(); onRemove(f.fileId) }}
                  className="shrink-0 text-slate-400 transition-colors hover:text-red-600"
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
