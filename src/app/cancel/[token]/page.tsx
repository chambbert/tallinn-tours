'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface TourInfo {
  tourTitle: string
  tourDate: string
  guestName: string
  groupSize: number
  status: string
}

interface PageProps {
  params: Promise<{ token: string }>
}

export default function CancelPage({ params }: PageProps) {
  const { token } = use(params)
  const [tourInfo, setTourInfo] = useState<TourInfo | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(`/api/registrations/cancel/${token}`)
        const data = await res.json()
        if (!res.ok) {
          setLoadError(data.error || 'Could not find this booking.')
        } else {
          setTourInfo(data)
          if (data.status === 'CANCELLED') {
            setCancelled(true)
          }
        }
      } catch {
        setLoadError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchInfo()
  }, [token])

  async function handleCancel() {
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await fetch(`/api/registrations/cancel/${token}`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          setCancelError('This booking has already been cancelled.')
          setCancelled(true)
        } else {
          setCancelError(data.error || 'Failed to cancel. Please try again.')
        }
      } else {
        setCancelled(true)
      }
    } catch {
      setCancelError('Network error. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-[#c9a84c] animate-spin" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle size={56} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Invalid Cancellation Link</h1>
          <p className="text-[#8892a4] mb-6">{loadError}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (cancelled) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Booking Cancelled</h1>
          <p className="text-[#8892a4] mb-2">
            Your booking for <span className="text-white font-medium">{tourInfo?.tourTitle}</span> has been
            successfully cancelled.
          </p>
          {tourInfo?.tourDate && (
            <p className="text-[#8892a4] text-sm mb-6">Tour date: {tourInfo.tourDate}</p>
          )}
          <p className="text-[#8892a4] text-sm mb-8">
            A cancellation confirmation has been sent to your email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              className="px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
            >
              Browse Other Tours
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h1
            className="text-3xl font-bold text-white font-serif mb-2"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Cancel Booking?
          </h1>
          <p className="text-[#8892a4]">
            This action cannot be undone.
          </p>
        </div>

        {tourInfo && (
          <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 mb-6">
            <h2
              className="text-white font-bold text-lg font-serif mb-4 pb-4 border-b border-[#232d42]"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              {tourInfo.tourTitle}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8892a4]">Date</span>
                <span className="text-white">{tourInfo.tourDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8892a4]">Guest</span>
                <span className="text-white">{tourInfo.guestName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8892a4]">Group Size</span>
                <span className="text-white">{tourInfo.groupSize} person{tourInfo.groupSize !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {cancelError && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
            <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{cancelError}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/40 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {cancelling ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel My Booking'
            )}
          </button>
          <Link
            href="/"
            className="block w-full py-3.5 text-center border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full transition-colors"
          >
            Keep My Booking
          </Link>
        </div>

        <p className="text-[#8892a4] text-xs text-center mt-5">
          Free cancellation up to 48 hours before your tour start time.
        </p>
      </div>
    </div>
  )
}
