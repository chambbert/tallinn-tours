import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { tourSchema } from '@/lib/validations'

export async function GET() {
  try {
    const now = new Date()

    const tours = await prisma.tour.findMany({
      where: {
        isActive: true,
        date: { gte: now },
      },
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: {
            registrations: {
              where: { status: 'CONFIRMED' },
            },
          },
        },
        registrations: {
          where: { status: 'CONFIRMED' },
          select: { groupSize: true },
        },
      },
    })

    const toursWithAvailability = tours.map((tour: typeof tours[number]) => {
      const bookedSpots = tour.registrations.reduce((sum: number, r: { groupSize: number }) => sum + r.groupSize, 0)
      const availableSpots = tour.capacity - bookedSpots
      const { registrations, ...tourData } = tour
      return {
        ...tourData,
        confirmedRegistrationsCount: tour._count.registrations,
        bookedSpots,
        availableSpots,
      }
    })

    return NextResponse.json(toursWithAvailability)
  } catch (error) {
    console.error('[GET /api/tours]', error)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = tourSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    const existing = await prisma.tour.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 409 })
    }

    const tour = await prisma.tour.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        date: new Date(data.date),
        durationMinutes: data.durationMinutes,
        meetingLocation: data.meetingLocation,
        meetingLocationDetails: data.meetingLocationDetails,
        price: data.price,
        capacity: data.capacity,
        imageUrl: data.imageUrl || null,
        category: data.category,
        isActive: data.isActive ?? true,
        highlights: data.highlights ?? [],
        includes: data.includes ?? [],
        difficulty: data.difficulty,
        language: data.language,
      },
    })

    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    console.error('[POST /api/tours]', error)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}
