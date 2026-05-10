import Link from 'next/link'
import TourForm from '@/components/TourForm'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'New Tour — Admin',
}

export default function NewTourPage() {
  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8892a4] mb-6">
        <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <Link href="/admin/tours" className="hover:text-white transition-colors">Tours</Link>
        <ChevronRight size={14} />
        <span className="text-white">New Tour</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create New Tour</h1>
        <p className="text-[#8892a4] mt-1">Fill in the details to publish a new tour.</p>
      </div>

      <TourForm mode="new" />
    </div>
  )
}
