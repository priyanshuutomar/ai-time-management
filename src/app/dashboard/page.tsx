'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Flame,
  Calendar,
  MessageSquare,
  ArrowRight,
  Star,
  AlertCircle,
  BarChart3,
  Zap,
} from 'lucide-react'
import AppLayout from '@/components/AppLayout'

const MOTIVATIONAL_QUOTES = [
  { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { quote: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { quote: "Don't count the days, make the days count.", author: 'Muhammad Ali' },
  { quote: 'Either you run the day or the day runs you.', author: 'Jim Rohn' },
  { quote: 'Time is the scarcest resource; unless it is managed, nothing else can be managed.', author: 'Peter Drucker' },
  { quote: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.', author: 'Stephen Covey' },
  { quote: 'Productivity is never an accident. It is always the result of a commitment to excellence.', author: 'Paul J. Meyer' },
]

interface Task {
  id: string
  title: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
  completed: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [focusHours] = useState(4.5)
  const [streak] = useState(7)

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem('ai-tasks')
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {
        setTasks([])
      }
    }
    // Random quote
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
    setQuote(MOTIVATIONAL_QUOTES[idx])
  }, [])

  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = tasks.filter((t) => !t.completed).length
  const totalTasks = tasks.length
  const productivityScore = totalTasks === 0
    ? 72
    : Math.round((completedTasks / totalTasks) * 40 + focusHours * 8 + streak * 2)

  const cappedScore = Math.min(100, productivityScore)

  // Upcoming deadlines (next 3 uncompleted, sorted by deadline)
  const upcomingDeadlines = tasks
    .filter((t) => !t.completed && t.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  const getDaysUntil = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days`
  }

  const getDeadlineColor = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'badge-red'
    if (days <= 2) return 'badge-yellow'
    return 'badge-blue'
  }

  const priorityColor = (p: string) => {
    if (p === 'high') return 'badge-red'
    if (p === 'medium') return 'badge-yellow'
    return 'badge-green'
  }

  const stats = [
    {
      icon: Target,
      label: 'Productivity Score',
      value: `${cappedScore}%`,
      sub: streak > 0 ? `${streak} day streak 🔥` : 'Keep going!',
      color: '#3b6bff',
      bg: 'rgba(59,107,255,0.12)',
      progress: cappedScore,
    },
    {
      icon: CheckCircle2,
      label: 'Completed Tasks',
      value: completedTasks.toString(),
      sub: `of ${totalTasks} total tasks`,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.12)',
      progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    },
    {
      icon: Clock,
      label: 'Focus Hours Today',
      value: `${focusHours}h`,
      sub: 'Deep work sessions',
      color: '#22d3ee',
      bg: 'rgba(34,211,238,0.12)',
      progress: (focusHours / 8) * 100,
    },
    {
      icon: AlertCircle,
      label: 'Pending Tasks',
      value: pendingTasks.toString(),
      sub: pendingTasks === 0 ? 'All clear! 🎉' : 'Tasks remaining',
      color: pendingTasks > 0 ? '#eab308' : '#22c55e',
      bg: pendingTasks > 0 ? 'rgba(234,179,8,0.12)' : 'rgba(34,197,94,0.12)',
      progress: totalTasks > 0 ? ((totalTasks - pendingTasks) / totalTasks) * 100 : 100,
    },
  ]

  return (
    <AppLayout
      title="Dashboard"
      subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
    >
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Motivational Quote */}
        <motion.div
          className="glass-card p-5 mb-8 border border-blue-500/10 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="flex items-start gap-4">
            <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#e0e0ff] font-medium italic text-lg leading-relaxed">
                &quot;{quote.quote}&quot;
              </p>
              <p className="text-[#8888aa] text-sm mt-1">— {quote.author}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <Flame className="w-4 h-4 text-[#555577]" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-[#8888aa] text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-[#555577] text-xs mb-3">{stat.sub}</div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                  style={{ background: `linear-gradient(90deg, ${stat.color}cc, ${stat.color})` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines */}
          <motion.div
            className="lg:col-span-2 glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-semibold">Upcoming Deadlines</h2>
              </div>
              <Link href="/planner">
                <button className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3 opacity-60" />
                <p className="text-[#8888aa] text-sm">No upcoming deadlines.</p>
                <Link href="/planner">
                  <button className="btn-primary text-sm mt-4 px-5 py-2">
                    Add Tasks
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <div>
                        <div className="text-white text-sm font-medium">{task.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`badge ${priorityColor(task.priority)} py-0 px-2 text-xs`}>
                            {task.priority}
                          </span>
                          <span className="text-[#555577] text-xs">{task.estimatedHours}h estimated</span>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getDeadlineColor(task.deadline)}`}>
                      {getDaysUntil(task.deadline)}
                    </span>
                  </div>
                ))}
                {tasks.filter((t) => !t.completed).length > 3 && (
                  <p className="text-[#555577] text-sm text-center pt-2">
                    +{tasks.filter((t) => !t.completed).length - 3} more tasks in planner
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-white font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  href: '/chatbot',
                  icon: MessageSquare,
                  label: 'Ask AI Coach',
                  sub: 'Get personalized advice',
                  color: '#3b6bff',
                  bg: 'rgba(59,107,255,0.12)',
                },
                {
                  href: '/planner',
                  icon: Calendar,
                  label: 'Smart Planner',
                  sub: 'Add & organize tasks',
                  color: '#9333ea',
                  bg: 'rgba(147,51,234,0.12)',
                },
                {
                  href: '/analytics',
                  icon: BarChart3,
                  label: 'View Analytics',
                  sub: 'Weekly insights',
                  color: '#22d3ee',
                  bg: 'rgba(34,211,238,0.12)',
                },
                {
                  href: '/chatbot',
                  icon: TrendingUp,
                  label: 'Boost Focus',
                  sub: 'Focus strategies',
                  color: '#22c55e',
                  bg: 'rgba(34,197,94,0.12)',
                },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: action.bg }}
                    >
                      <action.icon className="w-4 h-4" style={{ color: action.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{action.label}</div>
                      <div className="text-[#555577] text-xs">{action.sub}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#555577] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Weekly overview mini */}
        <motion.div
          className="mt-6 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-semibold">This Week at a Glance</h2>
            </div>
            <Link href="/analytics">
              <button className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300 transition-colors">
                Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [60, 80, 45, 90, 70, 40, 55]
              const isToday = i === new Date().getDay() - 1
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                    <motion.div
                      className="w-full rounded-t-md"
                      style={{
                        background: isToday
                          ? 'linear-gradient(180deg, #3b6bff, #7c3aed)'
                          : 'rgba(59,107,255,0.25)',
                        height: `${heights[i]}%`,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${heights[i]}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isToday ? 'text-blue-400' : 'text-[#555577]'
                    }`}
                  >
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
