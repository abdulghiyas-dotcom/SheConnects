import OpenAI from "openai"
import { env } from "@/lib/env"

let _groq: OpenAI | undefined
let _gemini: OpenAI | undefined

export function getGroqClient(): OpenAI {
  if (!_groq) {
    _groq = new OpenAI({
      apiKey: env.groqApiKey(),
      baseURL: "https://api.groq.com/openai/v1",
    })
  }
  return _groq
}

export function getGeminiClient(): OpenAI {
  if (!_gemini) {
    _gemini = new OpenAI({
      apiKey: env.googleAiApiKey(),
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    })
  }
  return _gemini
}

export const defaultModel = env.groqDefaultModel
export const fastModel    = env.groqFastModel
export const geminiModel  = env.geminiModel
