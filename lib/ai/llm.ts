import { groq, gemini, defaultModel, fastModel, geminiModel } from "./client"

type Message = {
  role: "user" | "system" | "assistant"
  content: string
}

// Calls Groq by default. If Groq is rate-limited (429), silently falls back to Gemini.
// All AI features in the platform call this function — never Groq/Gemini directly.
export async function callLLM(
  messages: Message[],
  opts?: { fast?: boolean }
): Promise<string> {
  const model = opts?.fast ? fastModel : defaultModel

  try {
    const res = await groq.chat.completions.create({ model, messages })
    return res.choices[0].message.content ?? ""
  } catch (err: unknown) {
    const error = err as { status?: number }
    if (error?.status === 429) {
      // Groq rate-limited — fall back to Gemini automatically
      const res = await gemini.chat.completions.create({
        model: geminiModel,
        messages,
      })
      return res.choices[0].message.content ?? ""
    }
    throw err
  }
}
