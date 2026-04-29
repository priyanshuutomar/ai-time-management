'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  BarChart3,
  Flame,
  Brain,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'
import AppLayout from '@/components/AppLayout'

const weeklyProductivity = [
  { day: 'Mon', productivity: 72, tasks: 4, focus: 3.5 },
  { day: 'Tue', productivity: 85, tasks: 6, focus: 5 },
  { day: 'Wed', productivity: 60, tasks: 3, focus: 2.5 },
  { day: 'Thu', productivity: 91, tasks: 8, focus: 6 },
  { day: 'Fri', productivity: 78, tasks: 5, focus: 4.5 },
  { day: 'Sat', productivity: 45, tasks: 2, focus: 2 },
  { day: 'Sun', productivity: 55, tasks: 3, focus: 3 },
]

const monthlyTrend = [
  { week: 'W1', score: 65, completed: 18 },
  { week: 'W2', score: 72, completed: 22 },
  { week: 'W3', score: 68, completed: 20 },
  { week: 'W4', score: 80, completed: 28 },
]

const focusDistribution = [
  { name: 'Deep Work', value: 35, color: '#3b6bff' },
  { name: 'Meetings', value: 20, color: '#9333ea' },
  { name: 'Planning', value: 15, color: '#22d3ee' },
  { name: 'Learning', value: 18, color: '#22c55e' },
  { name: 'Admin', value: 12, color: '#eab308' },
]

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: '#1a1a2e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#f0f0ff',
  fontSize: '12px',
  padding: '8px 12px',
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div style={CUSTOM_TOOLTIP_STYLE}>
      <p className="text-[#8888aa] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

interface InsightCard {
  icon: React.ElementType
  title: string
  value: string
  change: number
  color: string
  bg: string
}

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Array<{ completed: boolean; priority: string }>>([])
  const [aiInsight, setAiInsight] = useState<string>('')
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)

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

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const insights: InsightCard[] = [
    {
      icon: TrendingUp,
      title: 'Avg Productivity',
      value: '73%',
      change: 8,
      color: '#3b6bff',
      bg: 'rgba(59,107,255,0.12)',
    },
    {
      icon: Target,
      title: 'Task Completion',
      value: `${completionRate}%`,
      change: completionRate > 50 ? 5 : -3,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.12)',
    },
    {
      icon: Clock,
      title: 'Avg Focus Hours',
      value: '3.9h',
      change: 12,
      color: '#22d3ee',
      bg: 'rgba(34,211,238,0.12)',
    },
    {
      icon: Flame,
      title: 'Consistency Score',
      value: '82%',
      change: -2,
      color: '#f97316',
      bg: 'rgba(249,115,22,0.12)',
    },
  ]

  const getAIInsight = async () => {
    setIsLoadingInsight(true)
    setAiInsight('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Based on the following weekly productivity data, give me 3 specific, actionable insights to improve my time management next week:
              
Weekly Stats:
- Average productivity score: 73%
- Tasks completed this week: ${completedTasks} out of ${totalTasks || 31}
- Average focus hours per day: 3.9h
- Best day: Thursday (91% productivity)
- Worst day: Saturday (45% productivity)
- Consistency score: 82%

Please give me specific, practical recommendations.`,
            },
          ],
        }),
      })

      const data = await response.json()
      setAiInsight(data.message || 'Unable to generate insight at this time.')
    } catch {
      setAiInsight('Unable to connect to AI. Please try again.')
    } finally {
      setIsLoadingInsight(false)
    }
  }

  const TrendIcon = ({ change }: { change: number }) => {
    if (change > 0) return <ArrowUp className="w-3 h-3 text-green-400" />
    if (change < 0) return <ArrowDown className="w-3 h-3 text-red-400" />
    return <Minus className="w-3 h-3 text-[#8888aa]" />
  }

  const formatInsight = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #60a5fa">$1</strong>')
      .replace(/\n/g, '<br />')
  }

  return (
    <AppLayout
      title="Weekly Analytics"
      subtitle="Track your productivity trends and AI-powered insights"
    >
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {insights.map((card, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg }}
                >
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    card.change > 0
                      ? 'text-green-400'
                      : card.change < 0
                      ? 'text-red-400'
                      : 'text-[#8888aa]'
                  }`}
                >
                  <TrendIcon change={card.change} />
                  {Math.abs(card.change)}%
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">{card.value}</div>
              <div className="text-[#8888aa] text-xs">{card.title}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Bar Chart */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Daily Productivity Score</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyProductivity} barSize={28}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#8888aa', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#8888aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar
                  dataKey="productivity"
                  name="Score"
                  radius={[6, 6, 0, 0]}
                  fill="url(#blueGradient)"
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b6bff" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Focus Hours Line Chart */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Daily Focus Hours</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyProductivity}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#8888aa', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8888aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="focus"
                  name="Hours"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#cyanGradient)"
                  dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend */}
          <motion.div
            className="lg:col-span-2 glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-semibold text-sm">Monthly Progress Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#8888aa', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8888aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score %"
                  stroke="#9333ea"
                  strokeWidth={2.5}
                  dot={{ fill: '#9333ea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Tasks Done"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-green-400" />
              <h3 className="text-white font-semibold text-sm">Time Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={focusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {focusDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Time']}
                  contentStyle={CUSTOM_TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {focusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                    <span className="text-[#8888aa]">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">AI Productivity Insight</h3>
              <span className="badge badge-purple text-xs">Grok Powered</span>
            </div>
            <button
              onClick={getAIInsight}
              disabled={isLoadingInsight}
              className="btn-primary text-sm flex items-center gap-2 py-2 px-4 disabled:opacity-50"
            >
              {isLoadingInsight ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Get AI Insight
                </>
              )}
            </button>
          </div>

          {!aiInsight && !isLoadingInsight && (
            <div className="text-center py-6">
              <Brain className="w-10 h-10 text-[#555577] mx-auto mb-3" />
              <p className="text-[#8888aa] text-sm">
                Click &quot;Get AI Insight&quot; to receive personalized analysis of your productivity patterns
              </p>
            </div>
          )}

          {isLoadingInsight && (
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-2">
                <div className="typing-dot" style={{ background: '#9333ea' }} />
                <div className="typing-dot" style={{ background: '#9333ea', animationDelay: '0.2s' }} />
                <div className="typing-dot" style={{ background: '#9333ea', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {aiInsight && !isLoadingInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/3 border border-purple-500/15 rounded-xl p-4"
            >
              <div
                className="text-[#c0c0e0] text-sm leading-relaxed ai-prose"
                dangerouslySetInnerHTML={{ __html: formatInsight(aiInsight) }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Weekly Consistency Heatmap */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-semibold text-sm">Consistency Heatmap — Last 4 Weeks</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-[#555577] text-xs mb-2">{day}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const intensity = Math.random()
              const opacity = intensity < 0.2 ? 0.1 : intensity < 0.5 ? 0.35 : intensity < 0.75 ? 0.65 : 1
              return (
                <div
                  key={i}
                  className="h-8 rounded-lg transition-all hover:scale-110 cursor-pointer"
                  style={{
                    background: `rgba(59, 107, 255, ${opacity})`,
                    border: `1px solid rgba(59, 107, 255, ${opacity * 0.5})`,
                  }}
                  title={`${Math.round(intensity * 100)}% productive`}
                />
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[#555577] text-xs">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map((o, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm"
                style={{ background: `rgba(59, 107, 255, ${o})` }}
              />
            ))}
            <span className="text-[#555577] text-xs">More</span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
