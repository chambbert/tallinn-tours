import { NextResponse } from 'next/server'
import type { Registration } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { format } from 'date-fns'

type RegistrationWithTour = Registration & {
  tour: { title: string; date: Date }
}

function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Wrap in quotes if the field contains a comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildCsvRow(fields: (string | number | null | undefined)[]): string {
  return fields.map(escapeCsvField).join(',')
}

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const registrations = await prisma.registration.findMany({
      orderBy: [{ tour: { date: 'asc' } }, { createdAt: 'asc' }],
      include: {
        tour: {
          select: {
            title: true,
            date: true,
          },
        },
      },
    })

    const headers = [
      'ID',
      'Tour',
      'Tour Date',
      'Guest Name',
      'Email',
      'Phone',
      'Group Size',
      'Country',
      'City',
      'Status',
      'Special Requests',
      'Confirmation Code',
      'Registered At',
    ]

    const rows = (registrations as RegistrationWithTour[]).map((reg) =>
      buildCsvRow([
        reg.id,
        reg.tour.title,
        format(reg.tour.date, 'yyyy-MM-dd HH:mm'),
        reg.fullName,
        reg.email,
        reg.phone,
        reg.groupSize,
        reg.country,
        reg.city,
        reg.status,
        reg.specialRequests,
        reg.confirmationCode,
        format(reg.createdAt, 'yyyy-MM-dd HH:mm'),
      ])
    )

    const csv = [buildCsvRow(headers), ...rows].join('\r\n')

    const filename = `tallinn-tours-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/registrations/export]', error)
    return NextResponse.json({ error: 'Failed to export registrations' }, { status: 500 })
  }
}
