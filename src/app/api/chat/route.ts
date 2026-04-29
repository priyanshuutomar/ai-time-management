import { NextRequest, NextResponse } from 'next/server'

const XAI_API_KEY = process.env.XAI_API_KEY || ''
const XAI_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are an expert AI Time Management Coach. Your ONLY purpose is to help users with:
- Time management strategies and techniques
- Productivity improvement methods
- Procrastination overcoming techniques
- Study planning and academic scheduling
- Work planning and professional scheduling
- Self-discipline and habit formation
- Scheduling frameworks (time-blocking, Pomodoro, GTD, etc.)
- Focus improvement and deep work strategies
- Goal setting and daily routine optimization
- Daily and weekly routine design

STRICT RULES:
1. You MUST ONLY answer questions related to the topics listed above.
2. If a user asks about ANYTHING outside these topics (e.g. cooking, sports, politics, entertainment, coding help, math, science, relationships, news, etc.), you MUST respond EXACTLY with: "I am your AI Time Management Coach, so I can only help with productivity, scheduling, focus, and time management related questions."
3. Keep your responses practical, actionable, and encouraging.
4. Use bullet points and clear formatting when listing steps or techniques.
5. Be concise but thorough — focus on giving real, usable advice.
6. Always maintain a supportive and motivating tone.
7. Never break character or pretend to be a general-purpose assistant.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    if (!XAI_API_KEY) {
      return NextResponse.json(
        {
          message:
            '⚠️ API key not configured. Please add XAI_API_KEY to your .env.local file to enable the AI coach. You can get an API key from https://console.x.ai',
        },
        { status: 200 }
      )
    }

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error status:', response.status)
      console.error('Grok API error details:', errorText)
      
      let errorMsg = `Error from AI server (Status ${response.status}).`
      try {
        const parsedErr = JSON.parse(errorText)
        if (parsedErr.error && parsedErr.error.message) {
          errorMsg += ` Message: ${parsedErr.error.message}`
        }
      } catch (e) {
        errorMsg += ` Details: ${errorText.substring(0, 100)}`
      }
      
      return NextResponse.json(
        {
          message: `Connection failed. ${errorMsg}`,
        },
        { status: 200 } // keep 200 so frontend parses the message
      )
    }

    let data: Record<string, unknown>
    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('Failed to parse JSON response from Grok:', parseErr)
      return NextResponse.json(
        { message: 'Failed to parse AI response. Please try again.' },
        { status: 200 }
      )
    }

    const choices = data?.choices as Array<{ message?: { content?: string } }> | undefined
    const content = choices?.[0]?.message?.content

    if (!content || content.trim() === '') {
      return NextResponse.json(
        {
          message:
            "I didn't receive a response. Let me try again — could you rephrase your question?",
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ message: content })
  } catch (err: any) {
    console.error('Chat API catch error:', err.message || err)
    return NextResponse.json(
      {
        message: `Network or runtime error: ${err.message || 'Unknown error'}. Check terminal logs.`,
      },
      { status: 200 }
    )
  }
}
