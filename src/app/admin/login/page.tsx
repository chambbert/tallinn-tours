'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f1623]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span className="text-[#c9a84c] font-semibold tracking-[0.15em] text-lg uppercase">
              Tallinn Tours
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-[#8892a4] mt-1 text-sm">Sign in to manage tours and bookings</p>
        </div>

        <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-8">
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
                placeholder="admin@tallinn-tours.com"
                className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#d4a853] disabled:bg-[#c9a84c]/40 text-[#0f1623] font-bold rounded-full transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8892a4] text-xs mt-6">
          Admin access only. Not a staff member?{' '}
          <a href="/" className="text-[#c9a84c] hover:underline">
            Return to site
          </a>
        </p>
      </div>
    </div>
  )
}
