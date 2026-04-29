'use client'

import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Something Went Wrong</h2>
        <p className="text-[#8888aa] mb-2 text-sm">{error.message || 'An unexpected error occurred.'}</p>
        <p className="text-[#555577] text-xs mb-8">
          This might be a temporary issue. Try refreshing the page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary flex items-center gap-2 px-6 py-3">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/">
            <button className="btn-secondary flex items-center gap-2 px-6 py-3">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
