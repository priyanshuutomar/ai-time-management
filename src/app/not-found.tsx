'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a14] bg-grid flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 glow-blue">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-[#8888aa] mb-8">
          This page doesn&apos;t exist. Let&apos;s get you back on track with your productivity goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="btn-primary flex items-center gap-2 px-6 py-3">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-secondary flex items-center gap-2 px-6 py-3">
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
