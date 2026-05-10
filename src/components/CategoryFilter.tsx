'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const CATEGORIES = [
  { value: 'ALL', label: 'All Tours' },
  { value: 'WALKING', label: 'Walking' },
  { value: 'HISTORY', label: 'History' },
  { value: 'FOOD', label: 'Food' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'EVENING', label: 'Evening' },
  { value: 'ADVENTURE', label: 'Adventure' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') || 'ALL'

  function setCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'ALL') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat.value
              ? 'bg-[#c9a84c] text-[#0f1623]'
              : 'bg-[#1a2235] border border-[#232d42] text-[#8892a4] hover:text-white hover:border-[#c9a84c]/40'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
