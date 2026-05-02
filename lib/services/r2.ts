import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
export const r2Bucket = process.env.R2_BUCKET_NAME
const publicUrlBase = process.env.R2_PUBLIC_URL

export const isR2Configured = !!(accountId && accessKeyId && secretAccessKey && r2Bucket)

function getClient(): S3Client {
  if (!isR2Configured) {
    throw new Error("R2 storage is not configured — add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME to .env.local")
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  })
}

/** Returns a one-time presigned URL for a direct browser → R2 PUT upload (default 5 min TTL) */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<string> {
  return getSignedUrl(
    getClient(),
    new PutObjectCommand({ Bucket: r2Bucket!, Key: key, ContentType: contentType }),
    { expiresIn }
  )
}

/** Returns a signed download URL for a private file (default 1 hour TTL) */
export async function getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({ Bucket: r2Bucket!, Key: key }),
    { expiresIn }
  )
}

/** Returns the public URL for a file (requires the bucket to have public access enabled) */
export function getPublicUrl(key: string): string {
  if (publicUrlBase) return `${publicUrlBase.replace(/\/$/, "")}/${key}`
  return `https://${accountId}.r2.cloudflarestorage.com/${r2Bucket}/${key}`
}

export async function deleteR2File(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: r2Bucket!, Key: key }))
}
