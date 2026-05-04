import { NextRequest, NextResponse } from 'next/server'

const XAI_API_KEY = process.env.XAI_API_KEY || ''
const XAI_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

interface Task {
  id: string
  title: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
  completed: boolean
}

const PLANNER_SYSTEM_PROMPT = `You are an expert AI time management and scheduling assistant. 
Your role is to analyze a list of tasks and create an optimized, practical daily/weekly timetable.

When given a list of tasks with their deadlines, priorities, and estimated hours, you must:
1. Analyze urgency vs importance using the Eisenhower Matrix
2. Account for task priorities and deadlines
3. Suggest optimal time blocks (including breaks, deep work sessions)
4. Recommend which tasks to tackle first and why
5. Include Pomodoro-style work intervals if appropriate
6. Format your response as a clear, readable optimized schedule

Formatting rules:
- Use clear time blocks (e.g., "9:00 AM - 10:30 AM: Task Name")
- Group similar tasks together when possible
- Include short breaks every 90 minutes
- Highlight urgent/high-priority items clearly
- End with 3 specific productivity tips for this task list

Keep your response concise, practical, and immediately actionable.`

export async function POST(req: NextRequest) {
  let tasks: Task[] = []
  try {
    const body = await req.json()
    tasks = body.tasks || []

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: 'No tasks provided' },
        { status: 400 }
      )
    }

    if (!XAI_API_KEY) {
      return NextResponse.json(
        {
          suggestion: generateFallbackPlan(tasks),
        },
        { status: 200 }
      )
    }

    const taskList = tasks
      .filter((t) => !t.completed)
      .map(
        (t, i) =>
          `${i + 1}. "${t.title}" — Priority: ${t.priority}, Deadline: ${t.deadline}, Estimated: ${t.estimatedHours}h`
      )
      .join('\n')

    if (taskList.trim() === '') {
      return NextResponse.json(
        { suggestion: '✅ All tasks are completed! Great work. Add new tasks to get a fresh AI-optimized schedule.' },
        { status: 200 }
      )
    }

    const userMessage = `Please create an optimized timetable for these tasks:\n\n${taskList}\n\nCurrent date/time context: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: PLANNER_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 1500,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Planner Grok API error status:', response.status)
      console.error('Planner Grok API error details:', errorText)
      
      let errorMsg = `Error (Status ${response.status})`
      try {
        const parsedErr = JSON.parse(errorText)
        if (parsedErr.error && parsedErr.error.message) {
          errorMsg += `: ${parsedErr.error.message}`
        }
      } catch (e) {
        // Keep it simple
      }
      
      return NextResponse.json(
        { suggestion: generateFallbackPlan(tasks) + `\n\n[API Connection Failed: ${errorMsg}]` },
        { status: 200 }
      )
    }

    let data: Record<string, unknown>
    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('Planner failed to parse Grok JSON:', parseErr)
      return NextResponse.json(
        { suggestion: generateFallbackPlan(tasks) + '\n\n[Failed to parse AI response]' },
        { status: 200 }
      )
    }

    const choices = data?.choices as Array<{ message?: { content?: string } }> | undefined
    const content = choices?.[0]?.message?.content

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { suggestion: generateFallbackPlan(tasks) },
        { status: 200 }
      )
    }

    return NextResponse.json({ suggestion: content })
  } catch (err: any) {
    console.error('Planner API catch error:', err.message || err)
    return NextResponse.json(
      { suggestion: generateFallbackPlan(tasks) + `\n\n[Network Error: ${err.message || 'Unknown'}]` },
      { status: 200 }
    )
  }
}

function generateFallbackPlan(tasks: Task[]): string {
  const pending = tasks.filter((t) => !t.completed)
  const high = pending.filter((t) => t.priority === 'high')
  const medium = pending.filter((t) => t.priority === 'medium')
  const low = pending.filter((t) => t.priority === 'low')

  let plan = `📋 **AI-Optimized Schedule** (Basic Mode — Add API key for full AI plan)\n\n`

  plan += `**🔴 HIGH PRIORITY — Do First:**\n`
  if (high.length === 0) plan += `• No high-priority tasks\n`
  else high.forEach((t) => (plan += `• ${t.title} (${t.estimatedHours}h) — Due: ${t.deadline}\n`))

  plan += `\n**🟡 MEDIUM PRIORITY — Do Next:**\n`
  if (medium.length === 0) plan += `• No medium-priority tasks\n`
  else medium.forEach((t) => (plan += `• ${t.title} (${t.estimatedHours}h) — Due: ${t.deadline}\n`))

  plan += `\n**🟢 LOW PRIORITY — Do When Possible:**\n`
  if (low.length === 0) plan += `• No low-priority tasks\n`
  else low.forEach((t) => (plan += `• ${t.title} (${t.estimatedHours}h) — Due: ${t.deadline}\n`))

  const totalHours = pending.reduce((s, t) => s + t.estimatedHours, 0)
  plan += `\n**📊 Total estimated work: ${totalHours} hours across ${pending.length} tasks**\n`
  plan += `\n**💡 Tips:**\n• Start with your hardest high-priority task in the morning\n• Take a 5-min break every 25 minutes (Pomodoro technique)\n• Batch similar tasks together to reduce context-switching`

  return plan
}
