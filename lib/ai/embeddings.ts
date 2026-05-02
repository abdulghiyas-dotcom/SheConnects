import { HfInference } from "@huggingface/inference"
import { env } from "@/lib/env"

let _hf: HfInference | undefined

// Converts text into a 384-number vector for semantic search and matching.
// Used to match freelancer profiles to client briefs.
export async function embedText(text: string): Promise<number[]> {
  if (!_hf) _hf = new HfInference(env.huggingFaceApiKey())

  const result = await _hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  })

  return Array.isArray(result[0])
    ? (result[0] as number[])
    : (result as number[])
}
