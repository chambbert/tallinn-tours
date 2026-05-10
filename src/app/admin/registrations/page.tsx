import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'

import AdminRegistrationActions from '@/components/AdminRegistrationActions'

interface PageProps {
  searchParams: Promise<{ search?: string; tourId?: string; status?: string }>
}

export const metadata = {
  title: 'Registrations — Admin',
}

async function getRegistrations(search?: string, tourId?: string, status?: string) {
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (tourId) where.tourId = tourId
  if (status) where.status = status

  return prisma.registration.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      tour: { select: { id: true, title: true, date: true, price: true } },
    },
  })
}

async function getToursList() {
  return prisma.tour.findMany({
    select: { id: true, title: true },
    orderBy: { date: 'desc' },
  })
}

export default async function AdminRegistrationsPage({ searchParams }: PageProps) {
  const { search, tourId, status } = await searchParams

  const [registrations, toursList] = await Promise.all([
    getRegistrations(search, tourId, status),
    getToursList(),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Registrations</h1>
          <p className="text-[#8892a4] mt-1">{registrations.length} result{registrations.length !== 1 ? 's' : ''}</p>
        </div>
        <a
          href="/api/admin/registrations/export"
          className="px-5 py-2.5 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full text-sm transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name or email..."
          className="bg-[#1a2235] border border-[#232d42] rounded-xl px-4 py-2.5 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 text-sm w-64"
        />
        <select
          name="tourId"
          defaultValue={tourId || ''}
          className="bg-[#1a2235] border border-[#232d42] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]/60 text-sm"
        >
          <option value="" className="bg-[#1a2235]">All Tours</option>
          {toursList.map((t) => (
            <option key={t.id} value={t.id} className="bg-[#1a2235]">
              {t.title}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status || ''}
          className="bg-[#1a2235] border border-[#232d42] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]/60 text-sm"
        >
          <option value="" className="bg-[#1a2235]">All Statuses</option>
          <option value="CONFIRMED" className="bg-[#1a2235]">Confirmed</option>
          <option value="CANCELLED" className="bg-[#1a2235]">Cancelled</option>
          <option value="PENDING" className="bg-[#1a2235]">Pending</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623] font-semibold rounded-xl text-sm transition-colors"
        >
          Filter
        </button>
        {(search || tourId || status) && (
          <a
            href="/admin/registrations"
            className="px-5 py-2.5 border border-[#232d42] text-[#8892a4] hover:text-white rounded-xl text-sm transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl overflow-hidden">
        {registrations.length === 0 ? (
          <div className="px-6 py-16 text-center text-[#8892a4]">No registrations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232d42]">
                  {['Guest', 'Tour', 'Tour Date', 'Group', 'Country', 'Booked', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[#8892a4] text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => {
                  const price = Number(reg.tour.price)
                  return (
                    <tr key={reg.id} className="border-b border-[#232d42]/50 hover:bg-[#232d42]/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">{reg.fullName}</p>
                        <p className="text-[#8892a4] text-xs">{reg.email}</p>
                        <p className="text-[#8892a4] text-xs">{reg.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-[#8892a4] text-sm max-w-[160px]">
                        <p className="truncate">{reg.tour.title}</p>
                      </td>
                      <td className="px-4 py-3 text-[#8892a4] text-sm whitespace-nowrap">
                        {formatDate(reg.tour.date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-white text-sm font-medium">{reg.groupSize}</span>
                        <p className="text-[#8892a4] text-xs">{formatPrice(price * reg.groupSize)}</p>
                      </td>
                      <td className="px-4 py-3 text-[#8892a4] text-sm">
                        <p>{reg.city}</p>
                        <p className="text-xs">{reg.country}</p>
                      </td>
                      <td className="px-4 py-3 text-[#8892a4] text-sm whitespace-nowrap">
                        {new Date(reg.createdAt).toLocaleDateString('en-GB')}
                      </td>
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
                      <td className="px-4 py-3">
                        <AdminRegistrationActions
                          registrationId={reg.id}
                          currentStatus={reg.status}
                          confirmationCode={reg.confirmationCode}
                        />
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
