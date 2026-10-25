export type DietaryType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'UNSPECIFIED';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type EventLeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'QUOTED' | 'CONFIRMED' | 'LOST' | 'CLOSED';

export type EventType =
  | 'BIRTHDAY'
  | 'ANNIVERSARY'
  | 'CORPORATE'
  | 'GROUP_DINNER'
  | 'PRIVATE_DINING'
  | 'OTHER';

export type FeedbackCategory = 'FOOD' | 'SERVICE' | 'AMBIENCE' | 'BOOKING' | 'OTHER';

export type FeedbackStatus = 'NEW' | 'UNDER_REVIEW' | 'RESOLVED';

export type AdminRole = 'ADMIN' | 'STAFF';

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isPublished: boolean;
  _count?: {
    items: number;
  };
}

export interface MenuItemData {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  dietaryType: DietaryType;
  displayOrder: number;
  notes: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ReservationData {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  email: string | null;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  seatingPreference: string | null;
  occasion: string | null;
  specialRequest: string | null;
  status: ReservationStatus;
  internalNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface EventLeadData {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  email: string | null;
  eventType: EventType;
  eventDate: string;
  guestCount: number;
  budgetRange: string | null;
  decorationRequirements: string | null;
  notes: string | null;
  status: EventLeadStatus;
  assignedStaff: string | null;
  internalNotes?: string | null;
  quotedAmount: number | null;
  nextFollowUpDate: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CustomerFeedbackData {
  id: string;
  reference: string;
  visitReference: string | null;
  rating: number;
  category: FeedbackCategory;
  comments: string;
  customerName: string | null;
  customerPhone: string | null;
  contactConsent: boolean;
  status: FeedbackStatus;
  assignedStaff: string | null;
  internalNotes?: string | null;
  resolvedAt: string | Date | null;
  createdAt: string | Date;
}

export interface LoyaltyCustomerData {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  totalPoints: number;
  totalVisits: number;
  optedInAt: string | Date;
  isActive: boolean;
  transactions?: LoyaltyTransactionData[];
}

export interface LoyaltyTransactionData {
  id: string;
  customerId: string;
  points: number;
  actionType: 'VISIT_STAMP' | 'REWARD_REDEMPTION' | 'MANUAL_ADJUSTMENT';
  description: string;
  referenceCode: string | null;
  actorStaffId: string | null;
  createdAt: string | Date;
}

export interface LoyaltyRewardData {
  id: string;
  title: string;
  description: string | null;
  pointsRequired: number;
  isActive: boolean;
  createdAt: string | Date;
}

export interface SiteSettingsData {
  id: string;
  restaurantName: string;
  tagline: string;
  announcementActive: boolean;
  announcementText: string | null;
  address: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  secondaryPhoneVerified: boolean;
  email: string | null;
  whatsappNumber: string | null;
  openingHours: string | null;
  openingHoursJson: string | null;
  googleMapsUrl: string | null;
  districtUrl: string | null;
  linktreeUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  aboutStory: string | null;
  reservationLeadHours: number;
  maxPartySize: number;
  reservationPolicies: string | null;
  eventPolicies: string | null;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
}
