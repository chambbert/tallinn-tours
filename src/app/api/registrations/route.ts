import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registrationSchema } from '@/lib/validations'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'
import { format } from 'date-fns'

const APP_BASE_URL = process.env.APP_BASE_URL || 'https://tallinn-tours.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = registrationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Fetch the tour to validate it exists and is bookable
    const tour = await prisma.tour.findUnique({
      where: { id: data.tourId },
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    if (!tour.isActive) {
      return NextResponse.json({ error: 'This tour is no longer available' }, { status: 410 })
    }

    if (tour.date < new Date()) {
      return NextResponse.json({ error: 'This tour has already taken place' }, { status: 410 })
    }

    // Server-side capacity check — aggregate confirmed group sizes
    const capacityAggregate = await prisma.registration.aggregate({
      where: {
        tourId: data.tourId,
        status: 'CONFIRMED',
      },
      _sum: { groupSize: true },
    })

    const bookedSpots = capacityAggregate._sum.groupSize ?? 0
    const availableSpots = tour.capacity - bookedSpots

    if (data.groupSize > availableSpots) {
      return NextResponse.json(
        {
          error:
            availableSpots <= 0
              ? 'This tour is fully booked'
              : `Only ${availableSpots} ${availableSpots === 1 ? 'spot' : 'spots'} remaining — your group of ${data.groupSize} exceeds availability`,
          availableSpots,
        },
        { status: 409 }
      )
    }

    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        tourId: data.tourId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        groupSize: data.groupSize,
        country: data.country,
        city: data.city,
        specialRequests: data.specialRequests,
        status: 'CONFIRMED',
      },
      include: { tour: true },
    })

    const tourDate = format(tour.date, 'EEEE, d MMMM yyyy')
    const tourTime = format(tour.date, 'HH:mm')
    const cancellationUrl = `${APP_BASE_URL}/cancel/${registration.cancellationToken}`

    // Fire emails non-blocking — failures must not affect the response
    sendBookingConfirmation({
      to: registration.email,
      name: registration.fullName,
      tourTitle: tour.title,
      tourDate,
      tourTime,
      meetingLocation: tour.meetingLocation,
      groupSize: registration.groupSize,
      confirmationCode: registration.confirmationCode,
      cancellationUrl,
    }).catch((err) => console.error('[email] Booking confirmation failed:', err))

    sendAdminNotification({
      tourTitle: tour.title,
      guestName: registration.fullName,
      groupSize: registration.groupSize,
      email: registration.email,
      tourDate,
    }).catch((err) => console.error('[email] Admin notification failed:', err))

    return NextResponse.json(
      {
        id: registration.id,
        confirmationCode: registration.confirmationCode,
        tourTitle: tour.title,
        tourDate,
        tourTime,
        meetingLocation: tour.meetingLocation,
        groupSize: registration.groupSize,
        fullName: registration.fullName,
        email: registration.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/registrations]', error)
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
  }
}
