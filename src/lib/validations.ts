import { z } from 'zod';

// Indian mobile number validator (10 digits starting with 6, 7, 8, 9 with optional +91 or 0 prefix and spaces/hyphens)
export const indianPhoneRegex = /^(?:(?:\+|0{0,2})91[\s\-]?)?[0]?[6789](?:[\s\-]?\d){9}$/;

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

export function isPastDateKolkata(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return true;

  const now = new Date();
  const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  return dateStr < kolkataDateStr;
}

// 1. Reservation Validation
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
    .max(30, 'For parties larger than 30, please visit our Celebrations & Events page'),
  seatingPreference: z
    .enum(['INDOOR', 'GARDEN_AL_FRESCO', 'BAR_LOUNGE', 'ANY'])
    .default('ANY'),
  occasion: z
    .enum(['CASUAL', 'BIRTHDAY', 'ANNIVERSARY', 'BUSINESS', 'DATE_NIGHT', 'FAMILY_GATHERING'])
    .default('CASUAL'),
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
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED']),
  internalNotes: z.string().max(1000).optional().nullable(),
});

// State machine transition validator for reservations
export function isValidReservationTransition(
  current: string,
  target: string
): { valid: boolean; reason?: string } {
  const allowedMap: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    REJECTED: ['PENDING'],
    CANCELLED: ['PENDING'],
    COMPLETED: [],
  };

  const allowed = allowedMap[current] || [];
  if (allowed.includes(target) || current === target) {
    return { valid: true };
  }
  return {
    valid: false,
    reason: `Cannot transition reservation from ${current} to ${target}.`,
  };
}

// 2. Celebration and Event Lead Validation
export const EventLeadSubmissionSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().trim().refine((val) => indianPhoneRegex.test(val), {
    message: 'Please provide a valid Indian mobile number',
  }),
  email: z.string().trim().email('Valid email required').optional().or(z.literal('')),
  eventType: z.enum([
    'BIRTHDAY',
    'ANNIVERSARY',
    'CORPORATE',
    'GROUP_DINNER',
    'PRIVATE_DINING',
    'OTHER',
  ]),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine((val) => !isPastDateKolkata(val), {
      message: 'Event date cannot be in the past',
    }),
  guestCount: z.number().int().min(5, 'Event bookings typically start from 5 guests').max(500),
  budgetRange: z.string().trim().max(100).optional().or(z.literal('')),
  decorationRequirements: z.string().trim().max(500).optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Consent required to submit event inquiry',
  }),
});

export const EventLeadStatusUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTED', 'CONFIRMED', 'LOST', 'CLOSED']),
  assignedStaff: z.string().max(100).optional().nullable(),
  internalNotes: z.string().max(2000).optional().nullable(),
  quotedAmount: z.number().nonnegative().optional().nullable(),
  nextFollowUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal('')),
});

// 3. Customer Feedback Validation
export const CustomerFeedbackSubmissionSchema = z.object({
  visitReference: z.string().trim().max(50).optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Max 5 stars'),
  category: z.enum(['FOOD', 'SERVICE', 'AMBIENCE', 'BOOKING', 'OTHER']),
  comments: z.string().trim().min(5, 'Please provide at least a brief comment').max(2000),
  customerName: z.string().trim().max(80).optional().or(z.literal('')),
  customerPhone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || indianPhoneRegex.test(val), {
      message: 'Invalid phone number format',
    }),
  contactConsent: z.boolean().default(false),
});

export const CustomerFeedbackResolveSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'RESOLVED']),
  assignedStaff: z.string().max(100).optional().nullable(),
  internalNotes: z.string().max(2000).optional().nullable(),
});

// 4. Loyalty Program Validation
export const LoyaltyCustomerOptInSchema = z.object({
  phone: z.string().trim().refine((val) => indianPhoneRegex.test(val), {
    message: 'Valid Indian phone number required',
  }),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().optional().or(z.literal('')),
});

export const LoyaltyTransactionSchema = z.object({
  customerId: z.string().min(1),
  points: z.number().int().refine((val) => val !== 0, { message: 'Points cannot be zero' }),
  actionType: z.enum(['VISIT_STAMP', 'REWARD_REDEMPTION', 'MANUAL_ADJUSTMENT']),
  description: z.string().trim().min(1).max(200),
  referenceCode: z.string().trim().max(50).optional().nullable(),
});

export const LoyaltyRewardSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).optional().nullable(),
  pointsRequired: z.number().int().positive('Points required must be greater than zero'),
  isActive: z.boolean().default(true),
});

// 5. Admin & Menu Schemas
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
  address: z.string().trim().max(400).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  secondaryPhone: z.string().trim().max(50).optional().nullable(),
  secondaryPhoneVerified: z.boolean().default(false),
  email: z.string().trim().email().optional().nullable().or(z.literal('')),
  whatsappNumber: z.string().trim().max(20).optional().nullable(),
  openingHours: z.string().trim().max(300).optional().nullable(),
  openingHoursJson: z.string().trim().optional().nullable(),
  googleMapsUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  districtUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  linktreeUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  facebookUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  aboutStory: z.string().trim().max(3000).optional().nullable(),
  reservationLeadHours: z.number().int().min(0).max(72).default(2),
  maxPartySize: z.number().int().min(1).max(100).default(30),
  reservationPolicies: z.string().trim().max(1000).optional().nullable(),
  eventPolicies: z.string().trim().max(1000).optional().nullable(),
});
