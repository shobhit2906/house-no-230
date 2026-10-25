export type DietaryType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'UNSPECIFIED';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

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
  specialRequest: string | null;
  status: ReservationStatus;
  internalNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SiteSettingsData {
  id: string;
  restaurantName: string;
  tagline: string;
  announcementActive: boolean;
  announcementText: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsappNumber: string | null;
  openingHours: string | null;
  googleMapsUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  aboutStory: string | null;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
}
