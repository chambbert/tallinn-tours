import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'PENDING']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            meetingLocation: true,
            price: true,
            category: true,
          },
        },
      },
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json(registration)
  } catch (error) {
    console.error('[GET /api/registrations/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.registration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const body = await request.json()
    const result = patchSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/registrations/[id]]', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
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

    const existing = await prisma.registration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    await prisma.registration.delete({ where: { id } })

    return NextResponse.json({ message: 'Registration deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/registrations/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}
