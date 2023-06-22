import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'nodejs'

const REQUEST_LIMIT = 100 // Maximum number of requests allowed per day per user
const REQUEST_LIMIT_EXPIRY = 24 * 60 * 60 // Expiry time for the request limit (in seconds)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const session = await auth()

  if (process.env.VERCEL_ENV !== 'preview' && !previewToken) {
    if (session == null || !session?.user || !session?.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  if (session?.user?.id) {
    // Get the user ID from the session
    const userId = session?.user.id
    // Check if the user has reached the request limit
    const requestCount = parseInt(<string>await kv.get(`user:request:${userId}`))
    if (requestCount && requestCount >= REQUEST_LIMIT) {
      return new Response(`You have reached free-tier limit!`, { status: 429 })
    }

    // Update the request count for the user
    await kv.set(`user:request:${userId}`, requestCount + 1, {
      ex: REQUEST_LIMIT_EXPIRY
    })
  }

  const configuration = new Configuration({
    apiKey: previewToken || process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(configuration)

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const userId = session?.user.id
      if (userId) {
        const id = json.id ?? nanoid()
        const createdAt = Date.now()
        const path = `/chat/${id}`
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant'
            }
          ]
        }
        await kv.hmset(`chat:${id}`, payload)
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        })
      }
    }
  })

  return new StreamingTextResponse(stream)
}
