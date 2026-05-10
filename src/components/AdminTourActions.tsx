'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AdminTourActionsProps {
  tourId: string
  isActive: boolean
}

export default function AdminTourActions({ tourId, isActive }: AdminTourActionsProps) {
  const router = useRouter()
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    setToggling(true)
    try {
      await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/tours/${tourId}/edit`}
        className="px-3 py-1.5 bg-[#232d42] hover:bg-[#c9a84c]/20 text-[#8892a4] hover:text-[#c9a84c] rounded-lg text-xs font-medium transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
          isActive
            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
        }`}
      >
        {toggling ? (
          <Loader2 size={12} className="animate-spin" />
        ) : isActive ? (
          'Deactivate'
        ) : (
          'Activate'
        )}
      </button>
      <Link
        href={`/admin/registrations?tourId=${tourId}`}
        className="px-3 py-1.5 bg-[#232d42] hover:bg-[#c9a84c]/10 text-[#8892a4] hover:text-[#c9a84c] rounded-lg text-xs font-medium transition-colors"
      >
        Bookings
      </Link>
    </div>
  )
}
