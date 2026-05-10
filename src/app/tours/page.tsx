import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import TourCard from '@/components/TourCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Compass } from 'lucide-react'


export const metadata = {
  title: 'Tours — Tallinn Tours',
  description: 'Explore all our guided tours of Tallinn. Walking tours, history tours, food experiences, photography walks and more.',
}

async function getTours(category?: string) {
  const now = new Date()
  const where: Record<string, unknown> = {
    isActive: true,
    date: { gte: now },
  }
  if (category && category !== 'ALL') {
    where.category = category
  }

  const tours = await prisma.tour.findMany({
    where,
    orderBy: { date: 'asc' },
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
}

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ToursPage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const tours = await getTours(category)

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1623] via-[#1a2235] to-[#0f1623]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-[#c9a84c]/50" />
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">
              All Experiences
            </span>
            <div className="h-px w-16 bg-[#c9a84c]/50" />
          </div>
          <h1
            className="text-5xl font-bold text-white font-serif mb-4"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Our Tours
          </h1>
          <p className="text-[#8892a4] text-lg max-w-xl mx-auto">
            Every tour is a different door into Tallinn. Find the one that speaks to you.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {/* Filter bar */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Results count */}
        <p className="text-[#8892a4] text-sm mb-6">
          {tours.length} tour{tours.length !== 1 ? 's' : ''} available
          {category && category !== 'ALL' && (
            <span className="ml-2 px-2.5 py-0.5 bg-[#c9a84c]/10 text-[#c9a84c] rounded-full text-xs">
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </span>
          )}
        </p>

        {tours.length > 0 ? (
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
        ) : (
          <div className="text-center py-24 bg-[#1a2235] rounded-2xl border border-[#232d42]">
            <Compass size={48} className="text-[#c9a84c]/30 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-xl mb-2">No tours found</h3>
            <p className="text-[#8892a4]">
              {category && category !== 'ALL'
                ? `No ${category.toLowerCase()} tours currently scheduled. Try a different category.`
                : 'No upcoming tours are currently available. Check back soon!'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
