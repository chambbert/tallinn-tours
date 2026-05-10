'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface TourFormData {
  title: string
  slug: string
  description: string
  shortDescription: string
  date: string
  durationMinutes: number
  meetingLocation: string
  meetingLocationDetails: string
  price: number
  capacity: number
  imageUrl: string
  category: string
  difficulty: string
  language: string
  highlights: string[]
  includes: string[]
  isActive: boolean
}

interface TourFormProps {
  initialData?: Partial<TourFormData> & { id?: string }
  mode: 'new' | 'edit'
}

const defaultData: TourFormData = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  date: '',
  durationMinutes: 120,
  meetingLocation: '',
  meetingLocationDetails: '',
  price: 0,
  capacity: 20,
  imageUrl: '',
  category: 'WALKING',
  difficulty: 'EASY',
  language: 'English',
  highlights: [''],
  includes: [''],
  isActive: true,
}

export default function TourForm({ initialData, mode }: TourFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<TourFormData>(() => ({
    ...defaultData,
    ...initialData,
    highlights: initialData?.highlights?.length ? initialData.highlights : [''],
    includes: initialData?.includes?.length ? initialData.includes : [''],
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [autoSlug, setAutoSlug] = useState(mode === 'new')

  useEffect(() => {
    if (autoSlug && form.title) {
      setForm((p) => ({ ...p, slug: slugify(p.title) }))
    }
  }, [form.title, autoSlug])

  function set(field: keyof TourFormData, value: unknown) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  function setListItem(field: 'highlights' | 'includes', index: number, value: string) {
    setForm((p) => {
      const arr = [...p[field]]
      arr[index] = value
      return { ...p, [field]: arr }
    })
  }

  function addListItem(field: 'highlights' | 'includes') {
    setForm((p) => ({ ...p, [field]: [...p[field], ''] }))
  }

  function removeListItem(field: 'highlights' | 'includes', index: number) {
    setForm((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
      capacity: Number(form.capacity),
      highlights: form.highlights.filter((h) => h.trim()),
      includes: form.includes.filter((h) => h.trim()),
    }

    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/tours/${initialData.id}`
        : '/api/tours'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const errs = Object.entries(data.details.fieldErrors)
            .map(([f, msgs]) => `${f}: ${(msgs as string[]).join(', ')}`)
            .join('; ')
          setError(errs)
        } else {
          setError(data.error || 'Failed to save tour')
        }
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/admin/tours'), 1200)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-[#0f1623] border border-[#232d42] rounded-xl px-4 py-3 text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors text-sm'
  const labelClass = 'block text-[#8892a4] text-sm font-medium mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <CheckCircle size={18} className="text-green-400" />
          <p className="text-green-300 text-sm">Tour saved! Redirecting...</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              minLength={3}
              placeholder="Old Town Walking Tour"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setAutoSlug(false); set('slug', e.target.value) }}
              required
              placeholder="old-town-walking-tour"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Language</label>
            <input
              type="text"
              value={form.language}
              onChange={(e) => set('language', e.target.value)}
              placeholder="English"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description * (max 200 chars)</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              required
              minLength={20}
              maxLength={200}
              placeholder="A brief summary shown in tour cards"
              className={inputClass}
            />
            <p className="text-[#8892a4]/50 text-xs mt-1 text-right">
              {form.shortDescription.length}/200
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
              minLength={50}
              rows={6}
              placeholder="Detailed description of the tour..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Schedule & Logistics */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Schedule & Logistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date & Time *</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Duration (minutes) *</label>
            <input
              type="number"
              value={form.durationMinutes}
              onChange={(e) => set('durationMinutes', e.target.value)}
              required
              min={30}
              max={480}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Meeting Location *</label>
            <input
              type="text"
              value={form.meetingLocation}
              onChange={(e) => set('meetingLocation', e.target.value)}
              required
              placeholder="Viru Gate, Tallinn Old Town"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Meeting Location Details</label>
            <input
              type="text"
              value={form.meetingLocationDetails}
              onChange={(e) => set('meetingLocationDetails', e.target.value)}
              placeholder="Look for the guide holding the blue Tallinn Tours flag"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Pricing & Capacity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Price per Person (€) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
              min={0}
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max Capacity *</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)}
              required
              min={1}
              max={100}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              required
              className={inputClass}
            >
              {['WALKING', 'HISTORY', 'FOOD', 'PHOTOGRAPHY', 'EVENING', 'ADVENTURE'].map((c) => (
                <option key={c} value={c} className="bg-[#1a2235]">
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Difficulty *</label>
            <select
              value={form.difficulty}
              onChange={(e) => set('difficulty', e.target.value)}
              required
              className={inputClass}
            >
              {['EASY', 'MODERATE', 'CHALLENGING'].map((d) => (
                <option key={d} value={d} className="bg-[#1a2235]">
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Highlights</h3>
        <div className="space-y-3">
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => setListItem('highlights', i, e.target.value)}
                placeholder={`Highlight ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              {form.highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem('highlights', i)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('highlights')}
            className="flex items-center gap-2 text-[#c9a84c] hover:text-[#d4a853] text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Highlight
          </button>
        </div>
      </div>

      {/* Includes */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">What&apos;s Included</h3>
        <div className="space-y-3">
          {form.includes.map((inc, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={inc}
                onChange={(e) => setListItem('includes', i, e.target.value)}
                placeholder={`Included item ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              {form.includes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem('includes', i)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('includes')}
            className="flex items-center gap-2 text-[#c9a84c] hover:text-[#d4a853] text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Active toggle */}
      <div className="bg-[#1a2235] border border-[#232d42] rounded-2xl p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#232d42] rounded-full peer-checked:bg-[#c9a84c] transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Active</p>
            <p className="text-[#8892a4] text-xs">Active tours are visible to customers and can be booked</p>
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || success}
          className="flex-1 py-3.5 bg-[#c9a84c] hover:bg-[#d4a853] disabled:bg-[#c9a84c]/40 text-[#0f1623] font-bold rounded-full transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : mode === 'edit' ? (
            'Update Tour'
          ) : (
            'Create Tour'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/tours')}
          className="px-6 border border-[#232d42] hover:border-[#c9a84c]/40 text-[#8892a4] hover:text-white rounded-full transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
