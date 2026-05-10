import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice, getCategoryColor } from '@/lib/utils'

import AdminTourActions from '@/components/AdminTourActions'

async function getTours() {
  const tours = await prisma.tour.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: {
        select: {
          registrations: { where: { status: 'CONFIRMED' } },
        },
      },
      registrations: {
        where: { status: 'CONFIRMED' },
        select: { groupSize: true },
      },
    },
  })

  return tours.map((t) => {
    const bookedSpots = t.registrations.reduce((s, r) => s + r.groupSize, 0)
    return { ...t, bookedSpots }
  })
}

export default async function AdminToursPage() {
  const tours = await getTours()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tours</h1>
          <p className="text-[#8892a4] mt-1">{tours.length} total tours</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full text-sm transition-colors"
        >
          + New Tour
        </Link>
      </div>

      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl overflow-hidden">
        {tours.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[#8892a4] mb-4">No tours yet.</p>
            <Link
              href="/admin/tours/new"
              className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full text-sm transition-colors"
            >
              Create First Tour
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232d42]">
                  {['Tour', 'Date', 'Category', 'Capacity', 'Bookings', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[#8892a4] text-xs font-semibold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => {
                  const price = Number(tour.price)
                  const isPast = tour.date < new Date()
                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-[#232d42]/50 hover:bg-[#232d42]/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">{tour.title}</p>
                        <p className="text-[#8892a4] text-xs">{formatPrice(price)} per person</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#8892a4] text-sm">{formatDate(tour.date)}</p>
                        {isPast && (
                          <span className="text-xs text-amber-400">Past</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(tour.category)}`}
                        >
                          {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#8892a4] text-sm">{tour.capacity}</td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-medium">
                          {tour.bookedSpots}
                        </span>
                        <span className="text-[#8892a4] text-xs">
                          {' '}/ {tour.capacity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tour.isActive
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-[#232d42] text-[#8892a4]'
                          }`}
                        >
                          {tour.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminTourActions tourId={tour.id} isActive={tour.isActive} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
