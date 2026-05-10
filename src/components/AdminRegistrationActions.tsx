'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

interface Props {
  registrationId: string
  currentStatus: string
  confirmationCode: string
}

export default function AdminRegistrationActions({ registrationId, currentStatus, confirmationCode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function changeStatus(status: string) {
    setLoading(true)
    try {
      await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function deleteReg() {
    if (!confirm('Delete this registration permanently?')) return
    setLoading(true)
    try {
      await fetch(`/api/registrations/${registrationId}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/confirmation/${confirmationCode}`}
        target="_blank"
        className="px-2.5 py-1.5 bg-[#232d42] hover:bg-[#c9a84c]/10 text-[#8892a4] hover:text-[#c9a84c] rounded-lg text-xs font-medium transition-colors"
      >
        View
      </Link>
      {currentStatus !== 'CONFIRMED' && (
        <button
          onClick={() => changeStatus('CONFIRMED')}
          disabled={loading}
          className="px-2.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
        </button>
      )}
      {currentStatus !== 'CANCELLED' && (
        <button
          onClick={() => changeStatus('CANCELLED')}
          disabled={loading}
          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Cancel'}
        </button>
      )}
      <button
        onClick={deleteReg}
        disabled={loading}
        className="p-1.5 text-[#8892a4] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Delete registration"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
