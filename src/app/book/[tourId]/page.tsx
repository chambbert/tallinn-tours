import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import BookingForm from '@/components/BookingForm'
import { formatDate, formatTime, formatDuration, formatPrice } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ tourId: string }>
}

async function getTour(tourId: string) {
  const tour = await prisma.tour.findFirst({
    where: { id: tourId, isActive: true },
    include: {
      registrations: {
        where: { status: 'CONFIRMED' },
        select: { groupSize: true },
      },
    },
  })

  if (!tour) return null

  const bookedSpots = tour.registrations.reduce((s, r) => s + r.groupSize, 0)
  return { ...tour, availableSpots: tour.capacity - bookedSpots }
}

export async function generateMetadata({ params }: PageProps) {
  const { tourId } = await params
  const tour = await getTour(tourId)
  if (!tour) return {}
  return { title: `Book: ${tour.title} — Tallinn Tours` }
}

export default async function BookingPage({ params }: PageProps) {
  const { tourId } = await params
  const tour = await getTour(tourId)

  if (!tour) notFound()

  if (tour.date < new Date()) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Tour Has Passed</h1>
          <p className="text-[#8892a4] mb-6">This tour has already taken place.</p>
          <Link href="/tours" className="px-6 py-3 bg-[#c9a84c] text-[#0f1623] rounded-full font-semibold">
            Browse Other Tours
          </Link>
        </div>
      </div>
    )
  }

  if (tour.availableSpots <= 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Tour is Fully Booked</h1>
          <p className="text-[#8892a4] mb-6">Unfortunately this tour has no remaining spots.</p>
          <Link href="/tours" className="px-6 py-3 bg-[#c9a84c] text-[#0f1623] rounded-full font-semibold">
            Browse Other Tours
          </Link>
        </div>
      </div>
    )
  }

  const price = Number(tour.price)

  const tourData = {
    id: tour.id,
    title: tour.title,
    date: tour.date.toISOString(),
    durationMinutes: tour.durationMinutes,
    meetingLocation: tour.meetingLocation,
    price,
    availableSpots: tour.availableSpots,
    category: tour.category,
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#1a2235] border-b border-[#232d42]">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#8892a4]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/tours" className="hover:text-white transition-colors">Tours</Link>
            <ChevronRight size={14} />
            <Link href={`/tours/${tour.id}`} className="hover:text-white transition-colors truncate max-w-[200px]">{tour.title}</Link>
            <ChevronRight size={14} />
            <span className="text-white">Book</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold text-white font-serif mb-2"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Complete Your Booking
          </h1>
          <p className="text-[#8892a4]">Fill in your details to secure your spot on this tour.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Tour summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-5 pb-4 border-b border-[#232d42]">
                Tour Summary
              </h2>
              <h3
                className="text-white font-semibold text-xl font-serif mb-4"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                {tour.title}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={15} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#8892a4] text-xs">Date</p>
                    <p className="text-white text-sm">{formatDate(tour.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#8892a4] text-xs">Start Time</p>
                    <p className="text-white text-sm">{formatTime(tour.date)} · {formatDuration(tour.durationMinutes)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#8892a4] text-xs">Meeting Point</p>
                    <p className="text-white text-sm">{tour.meetingLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={15} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#8892a4] text-xs">Spots Remaining</p>
                    <p className={`text-sm font-medium ${tour.availableSpots < 5 ? 'text-amber-400' : 'text-white'}`}>
                      {tour.availableSpots} spot{tour.availableSpots !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#232d42]">
                <div className="flex justify-between items-center">
                  <span className="text-[#8892a4] text-sm">Price per person</span>
                  <span className="text-[#c9a84c] text-xl font-bold">{formatPrice(price)}</span>
                </div>
              </div>

              <p className="text-[#8892a4] text-xs mt-4">
                Free cancellation up to 48 hours before the tour. A confirmation email will be
                sent immediately after booking.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <BookingForm tour={tourData} />
          </div>
        </div>
      </div>
    </div>
  )
}
