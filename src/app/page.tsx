import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import TourCard from '@/components/TourCard'
import { MapPin, Users, Star, BookOpen, ArrowDown, Shield, Camera, Coffee } from 'lucide-react'


async function getFeaturedTours() {
  try {
    const now = new Date()
    const tours = await prisma.tour.findMany({
      where: { isActive: true, date: { gte: now } },
      orderBy: { date: 'asc' },
      take: 3,
      include: {
        registrations: {
          where: { status: 'CONFIRMED' },
          select: { groupSize: true },
        },
      },
    })
    return tours.map((t) => {
      const bookedSpots = t.registrations.reduce((s, r) => s + r.groupSize, 0)
      return { ...t, availableSpots: t.capacity - bookedSpots }
    })
  } catch {
    return []
  }
}

const testimonials = [
  {
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    text: "Hands down the best tour we took in all of Europe. Our guide Maris knew every hidden alley and had stories that no guidebook could ever capture. We fell completely in love with Tallinn.",
    rating: 5,
  },
  {
    name: 'Jonas Weber',
    country: 'Germany',
    text: "The evening tour through the old town was magical. Small group, personal attention, and we discovered places we never would have found on our own. Absolutely worth every cent.",
    rating: 5,
  },
  {
    name: 'Anya Kowalski',
    country: 'Poland',
    text: "I've done many guided tours but this was something different. You could feel the genuine passion the guides have for their city. The food tour alone was worth the trip to Tallinn.",
    rating: 5,
  },
]

export default async function HomePage() {
  const tours = await getFeaturedTours()

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1920&q=80"
          alt="Tallinn old town skyline"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1623]/60 via-[#0f1623]/40 to-[#0f1623]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-medium mb-6">
            <MapPin size={14} />
            <span>Tallinn, Estonia</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-serif"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Discover Tallinn&apos;s
            <br />
            <span className="text-[#c9a84c]">Hidden Stories</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Go beyond the tourist trail with passionate local guides who know every cobblestone,
            legend, and secret courtyard of this medieval Baltic gem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tours"
              className="px-8 py-4 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full text-base transition-colors duration-200 w-full sm:w-auto"
            >
              Browse Tours
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold rounded-full text-base transition-colors duration-200 w-full sm:w-auto"
            >
              Learn About Us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ArrowDown size={24} className="text-white/50" />
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-[#c9a84c]/50" />
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
              Upcoming Experiences
            </span>
            <div className="h-px w-16 bg-[#c9a84c]/50" />
          </div>
          <h2
            className="text-4xl font-bold text-white font-serif"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Featured Tours
          </h2>
          <p className="text-[#8892a4] mt-3 max-w-xl mx-auto">
            Carefully crafted experiences for curious travellers who want more than a surface-level visit.
          </p>
        </div>

        {tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={tour.title}
                  shortDescription={tour.shortDescription}
                  date={tour.date}
                  durationMinutes={tour.durationMinutes}
                  price={Number(tour.price)}
                  imageUrl={tour.imageUrl}
                  category={tour.category}
                  availableSpots={tour.availableSpots}
                  capacity={tour.capacity}
                  slug={tour.slug}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/tours"
                className="inline-block px-8 py-3.5 border border-[#c9a84c]/50 hover:border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 font-semibold rounded-full transition-all duration-200"
              >
                View All Tours
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-[#1a2235] rounded-2xl border border-[#232d42]">
            <p className="text-[#8892a4] text-lg">New tours coming soon. Check back shortly!</p>
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-[#1a2235] border-y border-[#232d42]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                Why Us
              </span>
              <div className="h-px w-16 bg-[#c9a84c]/50" />
            </div>
            <h2
              className="text-4xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              The Tallinn Tours Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin size={28} className="text-[#c9a84c]" />,
                title: 'Local Guides',
                desc: 'Born and raised Tallinn locals who live and breathe the city\'s history, secrets, and soul.',
              },
              {
                icon: <Users size={28} className="text-[#c9a84c]" />,
                title: 'Small Groups',
                desc: 'Maximum 20 people per tour. We believe intimate groups create far richer experiences.',
              },
              {
                icon: <BookOpen size={28} className="text-[#c9a84c]" />,
                title: 'Expert Knowledge',
                desc: 'Our guides hold history degrees and complete 200+ hours of training before their first tour.',
              },
              {
                icon: <Shield size={28} className="text-[#c9a84c]" />,
                title: 'Authentic Experience',
                desc: 'No scripted performances. Just genuine stories, real places, and honest conversations.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#0f1623] border border-[#232d42] rounded-2xl p-6 hover:border-[#c9a84c]/40 transition-colors"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[#8892a4] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                Our Story
              </span>
            </div>
            <h2
              className="text-4xl font-bold text-white font-serif mb-6"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              Passionate Locals,
              <br />
              Unforgettable Stories
            </h2>
            <p className="text-[#8892a4] leading-relaxed mb-4">
              Founded in 2018 by a group of Tallinn-born historians and storytellers, we set out
              to show visitors the city that tourists miss — the hidden courtyards, the forgotten
              legends, the living traditions that make Tallinn unlike anywhere else on earth.
            </p>
            <p className="text-[#8892a4] leading-relaxed mb-8">
              Seven years and 500+ happy guests later, we&apos;re still driven by the same simple
              belief: the best way to understand a city is through its people&apos;s stories.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-[#d4a853] font-semibold transition-colors"
            >
              Learn our story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 text-center">
              <div className="text-[#c9a84c] text-4xl font-bold font-serif mb-2">500+</div>
              <div className="text-[#8892a4] text-sm">Happy Guests</div>
            </div>
            <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 text-center mt-6">
              <div className="text-[#c9a84c] text-4xl font-bold font-serif mb-2">8</div>
              <div className="text-[#8892a4] text-sm">Expert Guides</div>
            </div>
            <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 text-center">
              <div className="text-[#c9a84c] text-4xl font-bold font-serif mb-2">15</div>
              <div className="text-[#8892a4] text-sm">Tour Routes</div>
            </div>
            <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6 text-center mt-6">
              <div className="text-[#c9a84c] text-4xl font-bold font-serif mb-2">4.9★</div>
              <div className="text-[#8892a4] text-sm">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#1a2235] border-y border-[#232d42]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-[#c9a84c]/50" />
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
                Guest Stories
              </span>
              <div className="h-px w-16 bg-[#c9a84c]/50" />
            </div>
            <h2
              className="text-4xl font-bold text-white font-serif"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#0f1623] border border-[#232d42] rounded-2xl p-6 hover:border-[#c9a84c]/30 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#c9a84c" className="text-[#c9a84c]" />
                  ))}
                </div>
                <p className="text-[#8892a4] leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#232d42] flex items-center justify-center text-[#c9a84c] font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-[#8892a4] text-xs">{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-14 border-b border-[#232d42]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Happy Guests' },
              { value: '8', label: 'Expert Guides' },
              { value: '15', label: 'Tour Routes' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-3xl font-bold text-[#c9a84c] font-serif mb-1"
                  style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                >
                  {stat.value}
                </div>
                <div className="text-[#8892a4] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Camera size={40} className="text-[#c9a84c]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white font-serif mb-6"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Ready to Explore Tallinn?
          </h2>
          <p className="text-[#8892a4] text-lg mb-10 leading-relaxed">
            Don&apos;t just visit Tallinn — understand it. Book a tour with us and leave with
            stories you&apos;ll be telling for years.
          </p>
          <Link
            href="/tours"
            className="inline-block px-10 py-4 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-bold rounded-full text-lg transition-colors duration-200"
          >
            Explore All Tours
          </Link>
          <p className="mt-4 text-[#8892a4] text-sm">
            <Coffee size={13} className="inline mr-1" />
            Free cancellation up to 48 hours before your tour
          </p>
        </div>
      </section>
    </div>
  )
}
