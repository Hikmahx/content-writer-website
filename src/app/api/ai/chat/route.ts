import {
  getAdminContextData,
  createSystemPrompt,
  getChatHistory,
} from '@/lib/ai'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_AI_KEY) {
      return Response.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      )
    }

    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return Response.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    // Extract message content if it's an object
    const messageContent =
      typeof message === 'string' ? message : message.content

    if (!messageContent) {
      return Response.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    const contextData = await getAdminContextData()
    if (!contextData) {
      return Response.json(
        { error: 'Unable to load admin data' },
        { status: 500 }
      )
    }

    const systemPrompt = createSystemPrompt(contextData)

    const chatHistory = await getChatHistory(sessionId)

    // Format messages for the AI
    const messages = [
      ...chatHistory.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.role === 'user' ? msg.message : msg.response,
      })),
      { role: 'user' as const, content: messageContent },
    ]

    // Prepare the messages array with system prompt first
    const allMessages = [{ role: 'system', content: systemPrompt }, ...messages]

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500,
        messages: allMessages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_AI_KEY}`,
        },
      }
    )

    const data = response.data
    const aiResponse =
      data.choices?.[0]?.message?.content ?? 'Could not generate response'

    // Chat saving is disabled by default (SAVE_CHAT_HISTORY=true to enable)

    return Response.json({ response: aiResponse, sessionId })
  } catch (err) {
    console.log(' Chat API error:', err)
    if (
      err instanceof Error &&
      'response' in err &&
      (err as any).response?.data
    ) {
      console.log('API Error', (err as any).response.data)
    }
    console.log(err)
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
