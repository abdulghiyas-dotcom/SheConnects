import OpenAI from "openai"
import { env } from "@/lib/env"

// Primary LLM — Groq (free, fast)
// Uses the openai-compatible API
export const groq = new OpenAI({
  apiKey: env.groqApiKey(),
  baseURL: "https://api.groq.com/openai/v1",
})

// Fallback LLM — Google Gemini (free, kicks in when Groq is rate-limited)
export const gemini = new OpenAI({
  apiKey: env.googleAiApiKey(),
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
})

export const defaultModel = env.groqDefaultModel   // smart tasks
export const fastModel    = env.groqFastModel       // fast/cheap tasks
export const geminiModel  = env.geminiModel         // fallback
