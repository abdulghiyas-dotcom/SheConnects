import Langfuse from "langfuse"
import { env } from "@/lib/env"

let _langfuse: Langfuse | undefined

// Langfuse Cloud — monitors all AI activity (cost, quality, latency)
// Free tier: 50,000 AI observations/month at cloud.langfuse.com
export function getLangfuse(): Langfuse {
  if (!_langfuse) {
    _langfuse = new Langfuse({
      secretKey: env.langfuseSecretKey(),
      publicKey: env.langfusePublicKey(),
      baseUrl: env.langfuseBaseUrl,
    })
  }
  return _langfuse
}
