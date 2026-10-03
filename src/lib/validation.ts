import { z } from 'zod'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Phone must be at least 7 characters')
    .regex(/^[\d+\s\-()]+$/, 'Phone may only contain digits, +, spaces, and dashes'),
  eventType: z.enum([
    'Wedding / Reception',
    'Sufi Night / Cultural Gala',
    'Private Mehfil',
    'Corporate Event',
    'International Festival',
  ] as const, { errorMap: () => ({ message: 'Please select an event type' }) }),
  eventDate: z
    .string()
    .min(1, 'Event date is required')
    .refine((val) => {
      const d = new Date(val)
      d.setHours(0, 0, 0, 0)
      return !isNaN(d.getTime()) && d >= today
    }, 'Event date must be today or in the future'),
  altDate: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  venueType: z.string().optional(),
  guestCount: z.enum([
    'Under 100',
    '100-300',
    '300-1000',
    '1000+',
  ] as const, { errorMap: () => ({ message: 'Please select an estimated guest count' }) }),
  notes: z
    .string()
    .max(1000, 'Notes must be under 1000 characters')
    .optional(),
  // Honeypot – must be empty (bots fill this automatically)
  website: z.string().max(0, 'This field must be empty').optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>
