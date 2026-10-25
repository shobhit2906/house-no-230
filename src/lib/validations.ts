import { z } from 'zod';

// Indian mobile number validator (10 digits starting with 6, 7, 8, 9 with optional +91 or 0 prefix and spaces/hyphens)
export const indianPhoneRegex = /^(?:(?:\+|0{0,2})91[\s\-]?)?[0]?[6789]\d{9}$/;

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

export function isPastDateKolkata(dateStr: string): boolean {
  // Parse YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return true;

  // Get current date in Asia/Kolkata timezone
  const now = new Date();
  const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
  return dateStr < kolkataDateStr;
}

export const ReservationSubmissionSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be under 80 characters'),
  phone: z
    .string()
    .trim()
    .refine((val) => indianPhoneRegex.test(val), {
      message: 'Please provide a valid Indian mobile number (10 digits starting with 6-9)',
    }),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .optional()
    .or(z.literal('')),
  reservationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine((val) => !isPastDateKolkata(val), {
      message: 'Reservation date cannot be in the past',
    }),
  reservationTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in 24-hour HH:mm format'),
  guestCount: z
    .number({ invalid_type_error: 'Guest count must be a number' })
    .int('Guest count must be an integer')
    .min(1, 'At least 1 guest required')
    .max(30, 'For parties larger than 30, please contact the restaurant directly'),
  specialRequest: z
    .string()
    .trim()
    .max(500, 'Special requests cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the privacy and booking terms to submit a request',
    }),
});

export const ReservationLookupSchema = z.object({
  reference: z.string().trim().min(5, 'Reference code required'),
  phone: z.string().trim().min(8, 'Phone number required'),
});

export const ReservationStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED']),
  internalNotes: z.string().max(1000).optional().nullable(),
});

export const AdminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const MenuItemSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().trim().min(1, 'Dish name is required').max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  price: z
    .number()
    .positive('Price must be greater than zero')
    .optional()
    .nullable()
    .or(z.literal(null)),
  currency: z.string().default('INR'),
  imageUrl: z.string().url('Invalid image URL').optional().nullable().or(z.literal('')),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  dietaryType: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'UNSPECIFIED']).default('UNSPECIFIED'),
  displayOrder: z.number().int().default(0),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const MenuCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(100),
  slug: z.string().trim().min(1, 'Slug is required').max(100),
  description: z.string().trim().max(500).optional().nullable(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const SiteSettingsSchema = z.object({
  restaurantName: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  announcementActive: z.boolean(),
  announcementText: z.string().trim().max(300).optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z.string().trim().email().optional().nullable().or(z.literal('')),
  whatsappNumber: z.string().trim().max(20).optional().nullable(),
  openingHours: z.string().trim().max(300).optional().nullable(),
  googleMapsUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  facebookUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  aboutStory: z.string().trim().max(3000).optional().nullable(),
});
