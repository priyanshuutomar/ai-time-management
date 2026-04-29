'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Brain,
  Calendar,
  Clock,
  ChevronDown,
  Loader2,
  Sparkles,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react'
import AppLayout from '@/components/AppLayout'

type Priority = 'high' | 'medium' | 'low'
type FilterType = 'all' | 'pending' | 'completed'

interface Task {
  id: string
  title: string
  deadline: string
  priority: Priority
  estimatedHours: number
  completed: boolean
  createdAt: string
}

const PRIORITY_CONFIG = {
  high: { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', badge: 'badge-red' },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.12)', badge: 'badge-yellow' },
  low: { label: 'Low', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', badge: 'badge-green' },
}

const DEFAULT_TASK: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  deadline: '',
  priority: 'medium',
  estimatedHours: 1,
  completed: false,
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...DEFAULT_TASK })
  const [filter, setFilter] = useState<FilterType>('all')
  const [aiSuggestion, setAiSuggestion] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ai-tasks')
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {
        setTasks([])
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!form.title.trim()) return

    const newTask: Task = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      estimatedHours: Number(form.estimatedHours) || 1,
    }

    setTasks((prev) => [newTask, ...prev])
    setForm({ ...DEFAULT_TASK })
    setShowForm(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const generateAIPlan = async () => {
    if (tasks.filter((t) => !t.completed).length === 0) {
      setAiSuggestion('✅ All tasks are completed! Add new tasks to get an AI-optimized schedule.')
      return
    }
    setIsGenerating(true)
    setAiError('')
    setAiSuggestion('')

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })

      if (!response.ok) throw new Error('Network error')

      let data: { suggestion?: string; error?: string }
      try {
        data = await response.json()
      } catch {
        data = { suggestion: 'Failed to parse AI response. Please try again.' }
      }

      setAiSuggestion(data.suggestion || 'Failed to generate plan. Please try again.')
    } catch {
      setAiError('Could not connect to AI planner. Please check your connection.')
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const pOrder = { high: 0, medium: 1, low: 2 }
    if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority]
    return new Date(a.deadline || '9999').getTime() - new Date(b.deadline || '9999').getTime()
  })

  const formatDeadline = (date: string) => {
    if (!date) return 'No deadline'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysUntil = (deadline: string) => {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Overdue'
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day'
    return `${diff} days`
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = tasks.filter((t) => !t.completed).length

  const formatAISuggestion = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #60a5fa">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
  }

  return (
    <AppLayout
      title="Smart Planner"
      subtitle="Add tasks · Get AI-optimized schedule · Track progress"
    >
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length, color: '#3b6bff' },
            { label: 'Pending', value: pendingCount, color: '#eab308' },
            { label: 'Completed', value: completedCount, color: '#22c55e' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="glass-card p-4 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl font-black mb-1" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[#8888aa] text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Tasks Column */}
          <div className="xl:col-span-3 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>

              <div className="flex items-center gap-1 bg-white/4 border border-white/8 rounded-xl p-1">
                {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      filter === f
                        ? 'bg-blue-600 text-white'
                        : 'text-[#8888aa] hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {tasks.length > 0 && (
                <div className="flex items-center gap-1 text-[#8888aa] text-xs ml-auto">
                  <Filter className="w-3 h-3" />
                  {sortedTasks.length} tasks
                </div>
              )}
            </div>

            {/* Add Task Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-5 border border-blue-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-400" />
                      New Task
                    </h3>
                    <button
                      onClick={() => { setShowForm(false); setForm({ ...DEFAULT_TASK }) }}
                      className="text-[#8888aa] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="input-primary"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[#8888aa] text-xs block mb-1">Deadline</label>
                        <input
                          type="date"
                          value={form.deadline}
                          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                          className="input-primary text-sm"
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                      <div>
                        <label className="text-[#8888aa] text-xs block mb-1">Priority</label>
                        <div className="relative">
                          <select
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                            className="input-primary text-sm appearance-none cursor-pointer"
                          >
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555577] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#8888aa] text-xs block mb-1">Hours Estimated</label>
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={form.estimatedHours}
                          onChange={(e) => setForm({ ...form, estimatedHours: parseFloat(e.target.value) })}
                          className="input-primary text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={addTask}
                        disabled={!form.title.trim()}
                        className="btn-primary text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Task
                      </button>
                      <button
                        onClick={() => { setShowForm(false); setForm({ ...DEFAULT_TASK }) }}
                        className="btn-secondary text-sm px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task List */}
            <div className="space-y-2">
              <AnimatePresence>
                {sortedTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10 text-center"
                  >
                    <Calendar className="w-10 h-10 text-[#555577] mx-auto mb-3" />
                    <p className="text-[#8888aa] text-sm">
                      {filter !== 'all'
                        ? `No ${filter} tasks`
                        : 'No tasks yet. Add your first task!'}
                    </p>
                    {filter === 'all' && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary text-sm mt-4 px-5 py-2"
                      >
                        Add First Task
                      </button>
                    )}
                  </motion.div>
                ) : (
                  sortedTasks.map((task) => {
                    const pc = PRIORITY_CONFIG[task.priority]
                    const daysUntil = getDaysUntil(task.deadline)

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all group ${
                          task.completed
                            ? 'bg-white/2 border-white/4 opacity-60'
                            : 'bg-white/4 border-white/6 hover:border-white/12'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#555577] hover:text-blue-400" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium ${
                              task.completed ? 'line-through text-[#555577]' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`badge ${pc.badge} text-xs py-0 px-2`}>
                              {pc.label}
                            </span>
                            {task.deadline && (
                              <span className="flex items-center gap-1 text-[#8888aa] text-xs">
                                <Calendar className="w-3 h-3" />
                                {formatDeadline(task.deadline)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[#8888aa] text-xs">
                              <Clock className="w-3 h-3" />
                              {task.estimatedHours}h
                            </span>
                            {daysUntil && !task.completed && (
                              <span
                                className={`text-xs font-medium ${
                                  daysUntil === 'Overdue'
                                    ? 'text-red-400'
                                    : daysUntil === 'Today'
                                    ? 'text-yellow-400'
                                    : 'text-[#8888aa]'
                                }`}
                              >
                                {daysUntil === 'Overdue' ? '⚠️ ' : ''}
                                {daysUntil}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#555577] hover:text-red-400 transition-all p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Planner Sidebar */}
          <div className="xl:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">AI Timetable Generator</h3>
              </div>
              <p className="text-[#8888aa] text-sm mb-4 leading-relaxed">
                Let the AI analyze your tasks and generate an optimized schedule based on priorities and deadlines.
              </p>
              <button
                onClick={generateAIPlan}
                disabled={isGenerating || tasks.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Schedule
                  </>
                )}
              </button>

              {tasks.length === 0 && (
                <p className="text-[#555577] text-xs text-center mt-2">
                  Add tasks first to generate a plan
                </p>
              )}
            </div>

            {/* AI Suggestion Output */}
            <AnimatePresence>
              {aiError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-4 border border-red-500/20"
                >
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {aiError}
                  </div>
                </motion.div>
              )}

              {aiSuggestion && !aiError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-5 border border-purple-500/15"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-semibold">AI Optimized Plan</span>
                  </div>
                  <div
                    className="text-[#c0c0e0] text-sm leading-relaxed ai-prose overflow-y-auto max-h-96"
                    dangerouslySetInnerHTML={{ __html: formatAISuggestion(aiSuggestion) }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <div className="glass-card p-5">
              <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Planning Tips
              </h4>
              <ul className="space-y-2 text-[#8888aa] text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Set realistic time estimates — add 20% buffer for unexpected interruptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  High priority tasks should be done during your peak energy hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Batch similar tasks to reduce context-switching fatigue
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  Review and update priorities daily to stay aligned with goals
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
