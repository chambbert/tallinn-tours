import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { Map, Users, TrendingUp, Calendar } from 'lucide-react'


async function getStats() {
  const now = new Date()

  const [totalTours, upcomingTours, totalRegistrations, revenueAgg, recentRegistrations] =
    await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { isActive: true, date: { gte: now } } }),
      prisma.registration.count({ where: { status: 'CONFIRMED' } }),
      prisma.registration.findMany({
        where: { status: 'CONFIRMED' },
        select: { groupSize: true, tour: { select: { price: true } } },
      }),
      prisma.registration.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          tour: { select: { title: true, date: true } },
        },
      }),
    ])

  const revenue = revenueAgg.reduce((sum: number, r: { groupSize: number; tour: { price: unknown } }) => {
    return sum + Number(r.tour.price) * r.groupSize
  }, 0)

  return { totalTours, upcomingTours, totalRegistrations, revenue, recentRegistrations }
}

export default async function AdminDashboard() {
  const { totalTours, upcomingTours, totalRegistrations, revenue, recentRegistrations } =
    await getStats()

  const stats = [
    {
      label: 'Total Tours',
      value: totalTours,
      icon: <Map size={22} className="text-[#c9a84c]" />,
    },
    {
      label: 'Upcoming Tours',
      value: upcomingTours,
      icon: <Calendar size={22} className="text-[#c9a84c]" />,
    },
    {
      label: 'Confirmed Bookings',
      value: totalRegistrations,
      icon: <Users size={22} className="text-[#c9a84c]" />,
    },
    {
      label: 'Est. Revenue',
      value: formatPrice(revenue),
      icon: <TrendingUp size={22} className="text-[#c9a84c]" />,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#8892a4] mt-1">Overview of your tour operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#8892a4] text-sm">{s.label}</p>
              {s.icon}
            </div>
            <p className="text-white text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/admin/tours/new"
          className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-full text-sm transition-colors"
        >
          + New Tour
        </Link>
        <Link
          href="/admin/tours"
          className="px-5 py-2.5 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full text-sm transition-colors"
        >
          Manage Tours
        </Link>
        <Link
          href="/admin/registrations"
          className="px-5 py-2.5 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full text-sm transition-colors"
        >
          View Registrations
        </Link>
        <a
          href="/api/admin/registrations/export"
          className="px-5 py-2.5 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full text-sm transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Recent registrations */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#232d42] flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Registrations</h2>
          <Link href="/admin/registrations" className="text-[#c9a84c] text-sm hover:underline">
            View all
          </Link>
        </div>
        {recentRegistrations.length === 0 ? (
          <div className="px-6 py-10 text-center text-[#8892a4]">No registrations yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232d42]">
                  {['Guest', 'Tour', 'Date', 'Group', 'Status', 'Booked'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[#8892a4] text-xs font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-[#232d42]/50 hover:bg-[#232d42]/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{reg.fullName}</p>
                      <p className="text-[#8892a4] text-xs">{reg.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#8892a4] text-sm">{reg.tour.title}</td>
                    <td className="px-4 py-3 text-[#8892a4] text-sm">{formatDate(reg.tour.date)}</td>
                    <td className="px-4 py-3 text-[#8892a4] text-sm">{reg.groupSize}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          reg.status === 'CONFIRMED'
                            ? 'bg-green-500/20 text-green-300'
                            : reg.status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8892a4] text-sm">
                      {new Date(reg.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
