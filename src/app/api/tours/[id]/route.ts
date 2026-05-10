import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { tourUpdateSchema } from '@/lib/validations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Support lookup by either cuid id or slug
    const tour = await prisma.tour.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    const bookedSpots = tour.registrations.reduce((sum: number, r: { groupSize: number }) => sum + r.groupSize, 0)
    const availableSpots = tour.capacity - bookedSpots
    const { registrations, ...tourData } = tour

    return NextResponse.json({
      ...tourData,
      confirmedRegistrationsCount: tour._count.registrations,
      bookedSpots,
      availableSpots,
    })
  } catch (error) {
    console.error('[GET /api/tours/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    const body = await request.json()
    const result = tourUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // If slug is being changed, check for conflicts
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await prisma.tour.findUnique({ where: { slug: data.slug } })
      if (slugConflict) {
        return NextResponse.json({ error: 'A tour with this slug already exists' }, { status: 409 })
      }
    }

    const updated = await prisma.tour.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
        ...(data.meetingLocation !== undefined && { meetingLocation: data.meetingLocation }),
        ...(data.meetingLocationDetails !== undefined && {
          meetingLocationDetails: data.meetingLocationDetails,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.highlights !== undefined && { highlights: data.highlights }),
        ...(data.includes !== undefined && { includes: data.includes }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.language !== undefined && { language: data.language }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT /api/tours/[id]]', error)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.tour.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    // Soft delete: deactivate rather than remove to preserve registration history
    const updated = await prisma.tour.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Tour deactivated successfully', tour: updated })
  } catch (error) {
    console.error('[DELETE /api/tours/[id]]', error)
    return NextResponse.json({ error: 'Failed to deactivate tour' }, { status: 500 })
  }
}
