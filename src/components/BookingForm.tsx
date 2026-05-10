'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Tour {
  id: string
  title: string
  date: string
  durationMinutes: number
  meetingLocation: string
  price: number
  availableSpots: number
  category: string
}

interface BookingFormProps {
  tour: Tour
}

interface FormState {
  fullName: string
  email: string
  phone: string
  groupSize: number
  country: string
  city: string
  specialRequests: string
}

interface SuccessData {
  confirmationCode: string
  tourTitle: string
  tourDate: string
  groupSize: number
  fullName: string
  email: string
}

export default function BookingForm({ tour }: BookingFormProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    groupSize: 1,
    country: '',
    city: '',
    specialRequests: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SuccessData | null>(null)

  const totalPrice = form.groupSize * tour.price

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'groupSize' ? Math.max(1, parseInt(value) || 1) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Basic validation
    if (form.groupSize > tour.availableSpots) {
      setError(`Only ${tour.availableSpots} spot${tour.availableSpots !== 1 ? 's' : ''} remaining for this tour.`)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          groupSize: Number(form.groupSize),
          tourId: tour.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(data.error || 'This tour is now fully booked. Please choose a different tour.')
        } else if (res.status === 400 && data.details) {
          const fieldErrors = data.details.fieldErrors
          const firstError = Object.values(fieldErrors)[0]
          setError(Array.isArray(firstError) ? firstError[0] as string : 'Please check your form and try again.')
        } else {
          setError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setSuccess(data)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#1a2235] border border-[#c9a84c]/30 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle size={32} className="text-[#c9a84c]" />
          <div>
            <h2 className="text-white font-bold text-xl">Booking Confirmed!</h2>
            <p className="text-[#8892a4] text-sm">A confirmation email has been sent to {success.email}</p>
          </div>
        </div>

        <div className="bg-[#0f1623] border border-[#232d42] rounded-xl p-5 mb-6">
          <p className="text-[#8892a4] text-xs uppercase tracking-wider mb-1">Confirmation Code</p>
          <p className="text-[#c9a84c] text-3xl font-bold font-mono">{success.confirmationCode}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#8892a4]">Tour</span>
            <span className="text-white font-medium">{success.tourTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8892a4]">Date</span>
            <span className="text-white">{success.tourDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8892a4]">Guest</span>
            <span className="text-white">{success.fullName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8892a4]">Group Size</span>
            <span className="text-white">{success.groupSize} person{success.groupSize !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-[#232d42]">
            <span className="text-[#8892a4]">Total Paid</span>
            <span className="text-[#c9a84c] font-bold">{formatPrice(success.groupSize * tour.price)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/confirmation/${success.confirmationCode}`}
            className="flex-1 py-3 text-center bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
          >
            View Booking
          </Link>
          <Link
            href="/tours"
            className="flex-1 py-3 text-center border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full transition-colors"
          >
            Browse More Tours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 space-y-5">
      <h2 className="text-white font-bold text-xl mb-2">Your Details</h2>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="fullName">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="Your full name"
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="email">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="phone">
            Phone <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="+372 555 0100"
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </div>

        {/* Group Size */}
        <div className="sm:col-span-2">
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="groupSize">
            Number of People <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              id="groupSize"
              name="groupSize"
              value={form.groupSize}
              onChange={handleChange}
              required
              min={1}
              max={Math.min(20, tour.availableSpots)}
              className="w-32 bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
            />
            <div className="flex-1 text-[#8892a4] text-sm">
              {form.groupSize > 1
                ? `${form.groupSize} people × ${formatPrice(tour.price)} = `
                : 'per person'}
              {form.groupSize > 1 && (
                <span className="text-[#c9a84c] font-bold">{formatPrice(totalPrice)}</span>
              )}
            </div>
          </div>
          {form.groupSize > tour.availableSpots && (
            <p className="text-amber-400 text-xs mt-1">
              Only {tour.availableSpots} spot{tour.availableSpots !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="country">
            Country <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="United Kingdom"
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="city">
            City <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="London"
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </div>

        {/* Special Requests */}
        <div className="sm:col-span-2">
          <label className="block text-[#8892a4] text-sm font-medium mb-1.5" htmlFor="specialRequests">
            Special Requests
            <span className="text-[#8892a4]/60 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            placeholder="Accessibility needs, dietary requirements, anything we should know..."
            className="w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
          />
          <p className="text-[#8892a4]/50 text-xs mt-1 text-right">
            {form.specialRequests.length}/500
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="bg-[#0f1623] border border-[#232d42] rounded-xl p-4 flex justify-between items-center">
        <span className="text-[#8892a4]">Total</span>
        <span className="text-[#c9a84c] text-2xl font-bold">{formatPrice(totalPrice)}</span>
      </div>

      <button
        type="submit"
        disabled={loading || form.groupSize > tour.availableSpots}
        className="w-full py-4 bg-[#c9a84c] hover:bg-[#d4a853] disabled:bg-[#c9a84c]/40 text-[#0f1623] font-bold rounded-full text-base transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Confirming your booking...
          </>
        ) : (
          `Confirm Booking — ${formatPrice(totalPrice)}`
        )}
      </button>

      <p className="text-[#8892a4] text-xs text-center">
        By booking you agree to our terms of service. Free cancellation up to 48 hours before the tour.
      </p>
    </form>
  )
}
