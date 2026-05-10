import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import TourForm from '@/components/TourForm'
import { ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Tour — Admin',
}

export default async function EditTourPage({ params }: PageProps) {
  const { id } = await params

  const tour = await prisma.tour.findUnique({ where: { id } })
  if (!tour) notFound()

  const price = Number(tour.price)

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const dateLocal = format(tour.date, "yyyy-MM-dd'T'HH:mm")

  const initialData = {
    id: tour.id,
    title: tour.title,
    slug: tour.slug,
    description: tour.description,
    shortDescription: tour.shortDescription,
    date: dateLocal,
    durationMinutes: tour.durationMinutes,
    meetingLocation: tour.meetingLocation,
    meetingLocationDetails: tour.meetingLocationDetails || '',
    price,
    capacity: tour.capacity,
    imageUrl: tour.imageUrl || '',
    category: tour.category,
    difficulty: tour.difficulty,
    language: tour.language,
    highlights: tour.highlights.length ? tour.highlights : [''],
    includes: tour.includes.length ? tour.includes : [''],
    isActive: tour.isActive,
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8892a4] mb-6">
        <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <Link href="/admin/tours" className="hover:text-white transition-colors">Tours</Link>
        <ChevronRight size={14} />
        <span className="text-white truncate">{tour.title}</span>
        <ChevronRight size={14} />
        <span className="text-white">Edit</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Tour</h1>
        <p className="text-[#8892a4] mt-1 truncate">{tour.title}</p>
      </div>

      <TourForm mode="edit" initialData={initialData} />
    </div>
  )
}
