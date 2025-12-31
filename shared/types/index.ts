/**
 * Shared TypeScript types for Sports Booking Platform
 * Used by both mobile (React Native) and web (Next.js) applications
 */

// ============================================
// DATABASE TABLE TYPES
// Matches Supabase schema
// ============================================

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'owner';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  sport_type: 'football' | 'badminton' | 'pickleball';
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  amenities: string[];
  price_per_hour: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueWithOwner extends Venue {
  owner_name: string | null;
  owner_phone: string | null;
  owner_avatar: string | null;
}

export interface Court {
  id: string;
  venue_id: string;
  name: string;
  type: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  court_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  is_available: boolean;
  price: number | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  time_slot_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithDetails extends Booking {
  user_name: string | null;
  user_phone: string | null;
  court_name: string | null;
  court_type: string | null;
  venue_name: string | null;
  sport_type: 'football' | 'badminton' | 'pickleball' | null;
  venue_address: string | null;
  date: string;
  start_time: string;
  end_time: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface AvailableSlot {
  slot_id: string;
  court_id: string;
  court_name: string;
  start_time: string;
  end_time: string;
  price: number;
}

export interface CreateVenueRequest {
  name: string;
  description?: string;
  sport_type: 'football' | 'badminton' | 'pickleball';
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  amenities?: string[];
  price_per_hour: number;
}

export interface UpdateVenueRequest extends Partial<CreateVenueRequest> {
  id: string;
  is_active?: boolean;
}

export interface CreateCourtRequest {
  venue_id: string;
  name: string;
  type?: string;
}

export interface CreateBookingRequest {
  court_id: string;
  time_slot_id: string;
  special_requests?: string;
}

// ============================================
// FILTER AND SEARCH TYPES
// ============================================

export interface VenueFilter {
  sport_type?: 'football' | 'badminton' | 'pickleball';
  city?: string;
  min_price?: number;
  max_price?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  search_query?: string;
}

export interface VenueSearchParams extends VenueFilter {
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'price' | 'rating' | 'distance';
  sort_order?: 'asc' | 'desc';
}

// ============================================
// UI STATE TYPES
// ============================================

export interface AuthState {
  user: Profile | null;
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface BookingState {
  selectedVenue: Venue | null;
  selectedCourt: Court | null;
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  step: 'venue' | 'court' | 'date' | 'slot' | 'confirm' | 'success';
}

// ============================================
// FORM TYPES
// ============================================

export interface SignUpForm {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'owner';
  phone?: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface VenueFormData extends CreateVenueRequest {
  // For image upload handling
  imageFiles?: File[];
}

// ============================================
// CONSTANTS
// ============================================

export const SPORT_TYPES = {
  FOOTBALL: 'football',
  BADMINTON: 'badminton',
  PICKLEBALL: 'pickleball',
} as const;

export const SPORT_TYPE_LABELS: Record<string, string> = {
  football: 'Football',
  badminton: 'Badminton',
  pickleball: 'Pickleball',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const USER_ROLES = {
  USER: 'user',
  OWNER: 'owner',
} as const;

export const TIME_SLOTS = [
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
  { value: '22:00', label: '10:00 PM' },
];

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export class BookingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'BookingError';
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ============================================
// UTILITY TYPES
// ============================================

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
