import { streamText, convertToModelMessages } from 'ai'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
