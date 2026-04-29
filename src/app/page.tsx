'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain, Clock, BarChart3, Calendar, ArrowRight, Zap, Target, TrendingUp,
  MessageSquare, CheckCircle, Sparkles, Shield
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Coach Chatbot',
    description: 'Chat with your personal AI time management coach powered by xAI Grok for smart productivity advice.',
    color: 'text-blue-400',
    glow: 'rgba(59, 107, 255, 0.15)',
  },
  {
    icon: Calendar,
    title: 'Smart Planner',
    description: 'Add tasks with deadlines and priorities. AI generates an optimized timetable tailored to your goals.',
    color: 'text-purple-400',
    glow: 'rgba(168, 85, 247, 0.15)',
  },
  {
    icon: BarChart3,
    title: 'Weekly Analytics',
    description: 'Track your consistency, productivity score, and get AI-powered insights to improve performance.',
    color: 'text-cyan-400',
    glow: 'rgba(34, 211, 238, 0.15)',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set daily and weekly goals, monitor progress, and stay on track with smart reminders.',
    color: 'text-green-400',
    glow: 'rgba(34, 197, 94, 0.15)',
  },
  {
    icon: Zap,
    title: 'Focus Mode',
    description: 'Deep work sessions with productivity scoring and focus hour tracking built into your dashboard.',
    color: 'text-yellow-400',
    glow: 'rgba(234, 179, 8, 0.15)',
  },
  {
    icon: TrendingUp,
    title: 'Productivity Trends',
    description: 'Visualize your productivity trends with beautiful charts and data-driven insights over time.',
    color: 'text-pink-400',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
]

const stats = [
  { value: '10x', label: 'Productivity Boost' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '50K+', label: 'Tasks Optimized' },
  { value: 'AI', label: 'Grok Powered' },
]

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Software Engineer',
    quote: 'The AI coach completely transformed how I manage my day. I accomplish 40% more work without feeling burned out.',
    avatar: 'AC',
    color: '#3b6bff',
  },
  {
    name: 'Priya Sharma',
    role: 'Medical Student',
    quote: 'The smart planner helps me balance study sessions, breaks, and revisions perfectly. My exam scores improved dramatically.',
    avatar: 'PS',
    color: '#9333ea',
  },
  {
    name: 'James Wright',
    role: 'Startup Founder',
    quote: 'Having an AI that only focuses on time management is brilliant. No distractions, just pure productivity coaching.',
    avatar: 'JW',
    color: '#22d3ee',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] bg-grid bg-glow-radial overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">AI Time Coach</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8888aa]">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">Reviews</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-[#8888aa] hover:text-white transition-colors hidden sm:block">
              Dashboard
            </Link>
            <Link href="/chatbot">
              <button className="btn-primary text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Start Coaching
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by xAI Grok — Your Smartest Productivity Partner
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Master Your Time with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#8888aa] max-w-3xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Your personal AI time management coach that helps you plan smarter, focus deeper, 
            and achieve more. Powered by Grok AI — always focused on productivity, nothing else.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/chatbot">
              <button className="btn-primary text-base flex items-center gap-2 px-8 py-4">
                <Brain className="w-5 h-5" />
                Chat with AI Coach
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary text-base flex items-center gap-2 px-8 py-4">
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </button>
            </Link>
          </motion.div>

          {/* Floating cards preview */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="glass-card p-6 max-w-2xl mx-auto border border-blue-500/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="message-ai text-left">
                  <p className="text-[#f0f0ff] text-sm leading-relaxed">
                    👋 Hi! I&apos;m your AI Time Management Coach. I can help you with:
                    <br /><br />
                    ✅ Creating optimal daily schedules<br />
                    ✅ Beating procrastination with proven techniques<br />
                    ✅ Building powerful study/work routines<br />
                    ✅ Improving focus and deep work sessions
                    <br /><br />
                    What would you like to work on today?
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="message-user text-sm">
                  How do I stop procrastinating and start my study sessions?
                </div>
              </div>
            </div>
            {/* Glow behind hero card */}
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-[#8888aa] text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-blue mb-4 mx-auto w-fit">Everything You Need</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Peak <span className="gradient-text">Performance</span>
            </h2>
            <p className="text-[#8888aa] text-lg max-w-2xl mx-auto">
              Every feature is designed with one goal: making you more productive with less stress.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card glass-card-hover p-6 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: f.glow }}
                >
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-[#8888aa] text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0d0d1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-[#8888aa] text-lg">Get started in minutes, see results in days.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'Chat with Your Coach',
                desc: 'Start a conversation with your AI coach. Ask about scheduling, focus strategies, or beating procrastination.',
                color: '#3b6bff',
              },
              {
                step: '02',
                icon: Calendar,
                title: 'Plan Your Tasks',
                desc: 'Add your tasks with deadlines. The AI analyzes them and creates the perfect optimized timetable for you.',
                color: '#9333ea',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Track & Improve',
                desc: 'Monitor your productivity score, weekly analytics, and get AI insights to continuously level up.',
                color: '#22d3ee',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                <div className="text-xs font-mono text-[#555577] mb-2">STEP {step.step}</div>
                <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-[#8888aa] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">Achievers</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-[#8888aa] text-xs">{t.role}</div>
                  </div>
                </div>
                <p className="text-[#aaaacc] text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="text-yellow-400 text-sm">★</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="glass-card p-12 border border-blue-500/10 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
            <div className="relative z-10">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your <span className="gradient-text">Productivity?</span>
              </h2>
              <p className="text-[#8888aa] mb-8 text-lg">
                Start chatting with your AI coach right now. No sign-up. No credit card. Just results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chatbot">
                  <button className="btn-primary text-base flex items-center gap-2 px-8 py-4">
                    <Brain className="w-5 h-5" />
                    Start AI Coaching Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/planner">
                  <button className="btn-secondary text-base flex items-center gap-2 px-8 py-4">
                    <Calendar className="w-5 h-5" />
                    Open Smart Planner
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">AI Time Management Coach</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#8888aa]">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/chatbot" className="hover:text-white transition-colors">AI Coach</Link>
            <Link href="/planner" className="hover:text-white transition-colors">Planner</Link>
            <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          </div>
          <div className="text-[#555577] text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Powered by xAI Grok
          </div>
        </div>
      </footer>
    </main>
  )
}
