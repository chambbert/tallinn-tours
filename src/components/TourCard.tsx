import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'
import { formatDate, formatTime, formatDuration, formatPrice, getCategoryColor } from '@/lib/utils'

interface TourCardProps {
  id: string
  title: string
  shortDescription: string
  date: Date | string
  durationMinutes: number
  price: number | string
  imageUrl?: string | null
  category: string
  availableSpots: number
  capacity: number
  slug?: string
}

export default function TourCard({
  id,
  title,
  shortDescription,
  date,
  durationMinutes,
  price,
  imageUrl,
  category,
  availableSpots,
  capacity,
}: TourCardProps) {
  const href = `/tours/${id}`
  const spotsLow = availableSpots < 5 && availableSpots > 0
  const soldOut = availableSpots <= 0

  return (
    <div className="group bg-[#1a2235] border border-[#232d42] rounded-2xl overflow-hidden hover:border-[#c9a84c]/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#232d42] to-[#0f1623] flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1"
              opacity="0.4"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2235] via-transparent to-transparent opacity-60" />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryColor(category)}`}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </span>
        </div>
        {/* Sold out overlay */}
        {soldOut && (
          <div className="absolute inset-0 bg-[#0f1623]/70 flex items-center justify-center">
            <span className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Fully Booked
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg leading-snug mb-2 group-hover:text-[#c9a84c] transition-colors font-serif">
          {title}
        </h3>
        <p className="text-[#8892a4] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {shortDescription}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[#8892a4] text-sm">
            <Calendar size={14} className="text-[#c9a84c] flex-shrink-0" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#8892a4] text-sm">
              <Clock size={14} className="text-[#c9a84c] flex-shrink-0" />
              <span>{formatTime(date)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8892a4] text-sm">
              <MapPin size={14} className="text-[#c9a84c] flex-shrink-0" />
              <span>{formatDuration(durationMinutes)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-[#c9a84c] flex-shrink-0" />
            {soldOut ? (
              <span className="text-red-400 font-medium">No spots remaining</span>
            ) : spotsLow ? (
              <span className="text-amber-400 font-medium">{availableSpots} spot{availableSpots !== 1 ? 's' : ''} left!</span>
            ) : (
              <span className="text-[#8892a4]">{availableSpots} of {capacity} spots available</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#232d42]">
          <div>
            <span className="text-[#c9a84c] font-bold text-xl">{formatPrice(price)}</span>
            <span className="text-[#8892a4] text-xs ml-1">per person</span>
          </div>
          <Link
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
              soldOut
                ? 'bg-[#232d42] text-[#8892a4] cursor-not-allowed'
                : 'bg-[#c9a84c] hover:bg-[#d4a853] text-[#0f1623]'
            }`}
          >
            {soldOut ? 'View Tour' : 'View Tour'}
          </Link>
        </div>
      </div>
    </div>
  )
}
