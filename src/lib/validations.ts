import { z } from 'zod'

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  groupSize: z
    .number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(20, 'Group size cannot exceed 20'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  specialRequests: z
    .string()
    .max(500, 'Special requests cannot exceed 500 characters')
    .optional(),
  tourId: z.string().min(1, 'Tour ID is required'),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

export const tourSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  shortDescription: z
    .string()
    .min(20, 'Short description must be at least 20 characters')
    .max(200, 'Short description cannot exceed 200 characters'),
  date: z.string().datetime('Date must be a valid ISO 8601 datetime string'),
  durationMinutes: z
    .number()
    .int('Duration must be a whole number')
    .min(30, 'Duration must be at least 30 minutes')
    .max(480, 'Duration cannot exceed 480 minutes (8 hours)'),
  meetingLocation: z.string().min(3, 'Meeting location must be at least 3 characters'),
  meetingLocationDetails: z.string().optional(),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price cannot exceed 10,000'),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity cannot exceed 100'),
  imageUrl: z.string().url('Image URL must be a valid URL').optional().or(z.literal('')),
  category: z.enum(['WALKING', 'HISTORY', 'FOOD', 'PHOTOGRAPHY', 'EVENING', 'ADVENTURE']),
  isActive: z.boolean().optional().default(true),
  highlights: z.array(z.string().min(1)).optional().default([]),
  includes: z.array(z.string().min(1)).optional().default([]),
  difficulty: z.enum(['EASY', 'MODERATE', 'CHALLENGING']),
  language: z.string().min(2, 'Language must be at least 2 characters').default('English'),
})

export type TourInput = z.infer<typeof tourSchema>

export const tourUpdateSchema = tourSchema.partial()

export type TourUpdateInput = z.infer<typeof tourUpdateSchema>
