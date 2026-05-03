import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const coreMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content || (m.parts ? m.parts.map((p: any) => p.text).join('') : '')
  }))

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: SYSTEM_PROMPT,
    messages: coreMessages,
  })

  return result.toUIMessageStreamResponse()
}
