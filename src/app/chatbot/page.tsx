'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Send,
  Trash2,
  RotateCcw,
  Clock,
  Target,
  Zap,
  BookOpen,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import AppLayout from '@/components/AppLayout'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { icon: Clock, text: 'Help me create a morning routine', color: '#3b6bff' },
  { icon: Target, text: 'How to stop procrastinating?', color: '#9333ea' },
  { icon: Zap, text: 'Best focus techniques for deep work', color: '#22d3ee' },
  { icon: BookOpen, text: 'Study planning for exams', color: '#22c55e' },
  { icon: Calendar, text: 'How to time-block my week?', color: '#eab308' },
  { icon: TrendingUp, text: 'Tips for consistent productivity', color: '#ec4899' },
]

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 **Welcome! I'm your AI Time Management Coach.**

I'm powered by xAI Grok and trained to be your personal productivity expert. Here's what I can help you with:

• 📅 **Scheduling & Time-Blocking** — Create optimal daily/weekly schedules
• ⚡ **Beat Procrastination** — Proven techniques to start and stay on track
• 🎯 **Goal Setting** — SMART goals and daily routine design
• 📚 **Study Planning** — Academic scheduling and revision strategies
• 💼 **Work Planning** — Professional time management and prioritization
• 🧘 **Focus & Deep Work** — Techniques to enter and sustain flow states
• 📊 **Habit Building** — Build discipline and consistent routines

**Ask me anything about time management!** I'm focused exclusively on productivity — so you'll always get expert, relevant advice.

What's your biggest time management challenge today?`,
  timestamp: new Date(),
}

function formatMessageContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• /gm, '<li>') 
    .replace(/^- /gm, '<li>')
    .replace(/\n/g, '<br />')
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: messageText }],
        }),
      })

      if (!response.ok) throw new Error('Network error')

      let data: { message?: string; error?: string }
      try {
        data = await response.json()
      } catch {
        data = { message: 'Failed to parse response. Please try again.' }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I encountered an issue. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I had trouble connecting. Please check your internet connection and try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <AppLayout
      title="AI Coach Chat"
      subtitle="Your personal time management expert — powered by Grok"
    >
      <div className="flex h-[calc(100vh-73px)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0d0d1e]/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[#8888aa] text-sm">AI Coach Online</span>
              <span className="badge badge-blue text-xs">Grok Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => sendMessage('Reset and start fresh')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8888aa] hover:text-white hover:bg-white/5 transition-all text-xs"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Restart</span>
              </button>
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8888aa] hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
                title="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Clear</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold'
                        : 'bg-gradient-to-br from-blue-600 to-purple-700'
                    }`}
                  >
                    {message.role === 'user' ? (
                      'U'
                    ) : (
                      <Brain className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col gap-1 max-w-[75%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div
                        className="message-ai ai-prose"
                        dangerouslySetInnerHTML={{
                          __html: formatMessageContent(message.content),
                        }}
                      />
                    ) : (
                      <div className="message-user">{message.content}</div>
                    )}
                    <span className="text-[#555577] text-xs px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="message-ai flex items-center gap-1.5 py-3 px-4">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 md:px-8 py-3 border-t border-white/5">
              <p className="text-[#555577] text-xs mb-3">Quick start — tap a topic:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 bg-white/3 text-[#8888aa] hover:text-white hover:border-opacity-40 transition-all text-xs"
                    style={{ borderColor: `${prompt.color}20` }}
                  >
                    <prompt.icon className="w-3 h-3" style={{ color: prompt.color }} />
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 md:px-8 py-4 border-t border-white/5 bg-[#0d0d1e]/30">
            <div className="flex items-end gap-3 bg-white/4 border border-white/8 rounded-2xl px-4 py-3 focus-within:border-blue-500/40 focus-within:bg-blue-500/5 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI coach about time management, focus, scheduling..."
                rows={1}
                className="flex-1 bg-transparent text-[#f0f0ff] text-sm outline-none resize-none placeholder:text-[#555577] leading-relaxed max-h-32"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30'
                    : 'bg-white/5 text-[#555577] cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[#444466] text-xs mt-2">
              Press Enter to send · Shift+Enter for new line · AI focused on time management only
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
