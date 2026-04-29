'use client'

import { useState } from 'react'
import { Menu, Bell, Search, Moon } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export default function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  const [time] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[#8888aa] hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">{title}</h1>
            {subtitle && <p className="text-[#8888aa] text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#555577]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#8888aa] outline-none w-32 placeholder:text-[#555577]"
            />
          </div>
          <div className="text-[#555577] text-sm font-mono hidden sm:block">{time}</div>
          <button className="w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-[#8888aa] hover:text-white hover:border-blue-500/30 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-[#8888aa] hover:text-white hover:border-blue-500/30 transition-all">
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
