import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingCancellation } from '@/lib/email'
import { format } from 'date-fns'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const registration = await prisma.registration.findUnique({
      where: { cancellationToken: token },
      include: {
        tour: {
          select: { title: true, date: true },
        },
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Cancellation token is invalid or has expired' },
        { status: 404 }
      )
    }

    const tourDate = format(registration.tour.date, 'EEEE, d MMMM yyyy')

    return NextResponse.json({
      tourTitle: registration.tour.title,
      tourDate,
      guestName: registration.fullName,
      groupSize: registration.groupSize,
      status: registration.status,
    })
  } catch (error) {
    console.error('[GET /api/registrations/cancel/[token]]', error)
    return NextResponse.json({ error: 'Failed to fetch booking info' }, { status: 500 })
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const registration = await prisma.registration.findUnique({
      where: { cancellationToken: token },
      include: {
        tour: {
          select: {
            title: true,
            date: true,
          },
        },
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Cancellation token is invalid or has expired' },
        { status: 404 }
      )
    }

    if (registration.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This booking has already been cancelled' },
        { status: 409 }
      )
    }

    // Update status to CANCELLED
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED' },
    })

    const tourDate = format(registration.tour.date, 'EEEE, d MMMM yyyy')

    // Send cancellation confirmation email — non-blocking
    sendBookingCancellation({
      to: registration.email,
      name: registration.fullName,
      tourTitle: registration.tour.title,
      tourDate,
    }).catch((err) => console.error('[email] Cancellation email failed:', err))

    return NextResponse.json({
      message: 'Your booking has been successfully cancelled',
      tourTitle: registration.tour.title,
      tourDate,
    })
  } catch (error) {
    console.error('[POST /api/registrations/cancel/[token]]', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}
