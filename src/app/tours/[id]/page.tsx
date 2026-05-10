import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate, formatTime, formatDuration, formatPrice, getCategoryColor, getDifficultyColor } from '@/lib/utils'
import { Calendar, Clock, Users, MapPin, Check, Globe, ChevronRight } from 'lucide-react'
import TourCard from '@/components/TourCard'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getTour(id: string) {
  const tour = await prisma.tour.findFirst({
    where: { OR: [{ id }, { slug: id }], isActive: true },
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

async function getRelatedTours(currentId: string, category: string) {
  const now = new Date()
  const tours = await prisma.tour.findMany({
    where: {
      isActive: true,
      date: { gte: now },
      category: category as never,
      id: { not: currentId },
    },
    take: 3,
    orderBy: { date: 'asc' },
    include: {
      registrations: {
        where: { status: 'CONFIRMED' },
        select: { groupSize: true },
      },
    },
  })

  return tours.map((t) => {
    const booked = t.registrations.reduce((s, r) => s + r.groupSize, 0)
    return { ...t, availableSpots: t.capacity - booked }
  })
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const tour = await getTour(id)
  if (!tour) return {}
  return {
    title: `${tour.title} — Tallinn Tours`,
    description: tour.shortDescription,
  }
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) notFound()

  const price = Number(tour.price)
  const soldOut = tour.availableSpots <= 0
  const relatedTours = await getRelatedTours(tour.id, tour.category)

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        {tour.imageUrl ? (
          <Image
            src={tour.imageUrl}
            alt={tour.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#232d42] to-[#0f1623]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1623] via-[#0f1623]/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryColor(tour.category)}`}>
              {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getDifficultyColor(tour.difficulty)}`}>
              {tour.difficulty.charAt(0) + tour.difficulty.slice(1).toLowerCase()}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-white font-serif"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            {tour.title}
          </h1>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="bg-[#1a2235] border-b border-[#232d42]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#8892a4]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/tours" className="hover:text-white transition-colors">Tours</Link>
            <ChevronRight size={14} />
            <span className="text-white truncate">{tour.title}</span>
          </div>
        </div>
      </div>

      {/* KEY DETAILS BAR */}
      <div className="bg-[#1a2235] border-b border-[#232d42]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Date</p>
                <p className="text-white text-sm font-medium">{formatDate(tour.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Time</p>
                <p className="text-white text-sm font-medium">{formatTime(tour.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Duration</p>
                <p className="text-white text-sm font-medium">{formatDuration(tour.durationMinutes)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Spots Left</p>
                <p className={`text-sm font-medium ${soldOut ? 'text-red-400' : tour.availableSpots < 5 ? 'text-amber-400' : 'text-white'}`}>
                  {soldOut ? 'Fully Booked' : `${tour.availableSpots} of ${tour.capacity}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Meeting Point</p>
                <p className="text-white text-sm font-medium truncate">{tour.meetingLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#c9a84c] flex-shrink-0" />
              <div>
                <p className="text-[#8892a4] text-xs">Language</p>
                <p className="text-white text-sm font-medium">{tour.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Description */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2
                className="text-2xl font-bold text-white font-serif mb-4"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                About This Tour
              </h2>
              <div className="text-[#8892a4] leading-relaxed whitespace-pre-wrap">
                {tour.description}
              </div>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold text-white font-serif mb-4"
                  style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                >
                  Tour Highlights
                </h2>
                <ul className="space-y-3">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-[#c9a84c]" />
                      </div>
                      <span className="text-[#8892a4]">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {tour.includes && tour.includes.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold text-white font-serif mb-4"
                  style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                >
                  What&apos;s Included
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-[#1a2235] border border-[#232d42] rounded-xl p-3">
                      <Check size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                      <span className="text-[#8892a4] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meeting Location */}
            <div>
              <h2
                className="text-2xl font-bold text-white font-serif mb-4"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                Meeting Location
              </h2>
              <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin size={18} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{tour.meetingLocation}</p>
                    {tour.meetingLocationDetails && (
                      <p className="text-[#8892a4] text-sm mt-1">{tour.meetingLocationDetails}</p>
                    )}
                  </div>
                </div>
                <p className="text-[#8892a4] text-sm pl-7">
                  Please arrive 10 minutes before the scheduled start time.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
                <div className="mb-5 pb-5 border-b border-[#232d42]">
                  <p className="text-[#8892a4] text-sm mb-1">Price per person</p>
                  <p className="text-[#c9a84c] text-4xl font-bold">{formatPrice(price)}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8892a4]">Date</span>
                    <span className="text-white font-medium text-right max-w-[60%]">{formatDate(tour.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8892a4]">Start time</span>
                    <span className="text-white font-medium">{formatTime(tour.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8892a4]">Duration</span>
                    <span className="text-white font-medium">{formatDuration(tour.durationMinutes)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8892a4]">Availability</span>
                    <span className={`font-medium ${soldOut ? 'text-red-400' : tour.availableSpots < 5 ? 'text-amber-400' : 'text-white'}`}>
                      {soldOut ? 'Fully Booked' : `${tour.availableSpots} spots left`}
                    </span>
                  </div>
                </div>

                {soldOut ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-[#232d42] text-[#8892a4] rounded-full font-semibold cursor-not-allowed"
                  >
                    Fully Booked
                  </button>
                ) : (
                  <Link
                    href={`/book/${tour.id}`}
                    className="block w-full py-3.5 text-center bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] rounded-full font-bold transition-colors duration-200"
                  >
                    Book This Tour
                  </Link>
                )}

                <p className="text-[#8892a4] text-xs text-center mt-4">
                  Free cancellation up to 48 hours before the tour
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED TOURS */}
      {relatedTours.length > 0 && (
        <section className="py-16 border-t border-[#232d42]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-2xl font-bold text-white font-serif"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                Similar Tours
              </h2>
              <Link href="/tours" className="text-[#c9a84c] hover:text-[#d4a853] text-sm font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.map((t) => (
                <TourCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  shortDescription={t.shortDescription}
                  date={t.date}
                  durationMinutes={t.durationMinutes}
                  price={Number(t.price)}
                  imageUrl={t.imageUrl}
                  category={t.category}
                  availableSpots={t.availableSpots}
                  capacity={t.capacity}
                  slug={t.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
