export function formatPrice(price: number | string): string {
  return `€${Number(price).toFixed(2)}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    WALKING: 'bg-blue-500/20 text-blue-300',
    HISTORY: 'bg-amber-500/20 text-amber-300',
    FOOD: 'bg-green-500/20 text-green-300',
    PHOTOGRAPHY: 'bg-purple-500/20 text-purple-300',
    EVENING: 'bg-indigo-500/20 text-indigo-300',
    ADVENTURE: 'bg-red-500/20 text-red-300',
  }
  return colors[category] || 'bg-gray-500/20 text-gray-300'
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: 'bg-green-500/20 text-green-300',
    MODERATE: 'bg-yellow-500/20 text-yellow-300',
    CHALLENGING: 'bg-red-500/20 text-red-300',
  }
  return colors[difficulty] || 'bg-gray-500/20 text-gray-300'
}
