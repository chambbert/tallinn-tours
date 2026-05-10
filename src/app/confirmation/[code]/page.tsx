import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatTime, formatDuration, formatPrice } from '@/lib/utils'
import { CheckCircle, Calendar, Clock, MapPin, Users, XCircle } from 'lucide-react'


interface PageProps {
  params: Promise<{ code: string }>
}

export const metadata = {
  title: 'Booking Confirmation — Tallinn Tours',
}

async function getRegistration(code: string) {
  return prisma.registration.findUnique({
    where: { confirmationCode: code },
    include: {
      tour: true,
    },
  })
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { code } = await params
  const registration = await getRegistration(code)

  if (!registration) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle size={56} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Booking Not Found</h1>
          <p className="text-[#8892a4] mb-6">
            We couldn&apos;t find a booking with confirmation code <span className="text-white font-mono">{code}</span>.
            This code may be incorrect or the booking may have been removed.
          </p>
          <Link
            href="/tours"
            className="px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    )
  }

  const tour = registration.tour
  const price = Number(tour.price)
  const totalPrice = price * registration.groupSize
  const isCancelled = registration.status === 'CANCELLED'

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Status header */}
        <div className="text-center mb-10">
          {isCancelled ? (
            <>
              <XCircle size={56} className="text-red-400 mx-auto mb-4" />
              <h1
                className="text-3xl font-bold text-white font-serif mb-2"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                Booking Cancelled
              </h1>
              <p className="text-[#8892a4]">This booking has been cancelled.</p>
            </>
          ) : (
            <>
              <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-4" />
              <h1
                className="text-3xl font-bold text-white font-serif mb-2"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                Booking Confirmed
              </h1>
              <p className="text-[#8892a4]">
                A confirmation email has been sent to {registration.email}
              </p>
            </>
          )}
        </div>

        {/* Confirmation code */}
        <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 mb-6">
          <div className="text-center mb-5 pb-5 border-b border-[#232d42]">
            <p className="text-[#8892a4] text-xs uppercase tracking-wider mb-1">Confirmation Code</p>
            <p className="text-[#c9a84c] text-4xl font-bold font-mono">{registration.confirmationCode}</p>
            <p className="text-[#8892a4] text-xs mt-2">Keep this code to manage your booking</p>
          </div>

          {/* Tour details */}
          <h2
            className="text-white font-bold text-xl font-serif mb-4"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            {tour.title}
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#8892a4] text-xs">Date</p>
                <p className="text-white text-sm">{formatDate(tour.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#8892a4] text-xs">Time & Duration</p>
                <p className="text-white text-sm">{formatTime(tour.date)} · {formatDuration(tour.durationMinutes)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#8892a4] text-xs">Meeting Point</p>
                <p className="text-white text-sm">{tour.meetingLocation}</p>
                {tour.meetingLocationDetails && (
                  <p className="text-[#8892a4] text-xs mt-0.5">{tour.meetingLocationDetails}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 pb-3 border-b border-[#232d42]">
            Booking Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Guest Name</span>
              <span className="text-white">{registration.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Email</span>
              <span className="text-white">{registration.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Phone</span>
              <span className="text-white">{registration.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Group Size</span>
              <span className="text-white flex items-center gap-1">
                <Users size={13} className="text-[#c9a84c]" />
                {registration.groupSize} person{registration.groupSize !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Country / City</span>
              <span className="text-white">{registration.city}, {registration.country}</span>
            </div>
            {registration.specialRequests && (
              <div className="pt-2 border-t border-[#232d42]">
                <p className="text-[#8892a4] text-xs mb-1">Special Requests</p>
                <p className="text-white text-sm">{registration.specialRequests}</p>
              </div>
            )}
            <div className="flex justify-between text-sm pt-3 border-t border-[#232d42]">
              <span className="text-[#8892a4]">Status</span>
              <span className={`font-medium ${isCancelled ? 'text-red-400' : 'text-green-400'}`}>
                {registration.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8892a4]">Total Amount</span>
              <span className="text-[#c9a84c] font-bold text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isCancelled && (
          <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-5 mb-6">
            <p className="text-[#8892a4] text-sm mb-4">
              Need to cancel? You can cancel your booking for free up to 48 hours before the tour.
            </p>
            <Link
              href={`/cancel/${registration.cancellationToken}`}
              className="inline-block text-sm text-red-400 hover:text-red-300 font-medium border border-red-500/30 hover:border-red-500/50 rounded-full px-5 py-2.5 transition-colors"
            >
              Cancel This Booking
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tours"
            className="flex-1 py-3.5 text-center bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full transition-colors"
          >
            Browse More Tours
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 text-center border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
