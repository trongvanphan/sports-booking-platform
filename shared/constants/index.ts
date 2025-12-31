/**
 * Shared constants for Sports Booking Platform
 */

// ============================================
// SUPABASE CONFIG
// Note: Replace these with your actual Supabase project values
// ============================================

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

// ============================================
// TABLE NAMES
// ============================================

export const TABLES = {
  PROFILES: 'profiles',
  VENUES: 'venues',
  COURTS: 'courts',
  TIME_SLOTS: 'time_slots',
  BOOKINGS: 'bookings',
} as const;

// ============================================
// VIEWS NAMES
// ============================================

export const VIEWS = {
  VENUES_WITH_OWNER: 'venues_with_owner',
  BOOKINGS_WITH_DETAILS: 'bookings_with_details',
} as const;

// ============================================
// STORAGE BUCKETS
// ============================================

export const BUCKETS = {
  VENUE_IMAGES: 'venue-images',
  AVATARS: 'avatars',
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  VENUES: '/venues',
  VENUE_DETAIL: '/venues/:id',

  // Auth routes
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  SIGN_OUT: '/auth/signout',

  // Booking routes
  BOOKING: '/booking',
  MY_BOOKINGS: '/bookings',
  BOOKING_DETAIL: '/bookings/:id',

  // Owner routes
  OWNER_DASHBOARD: '/owner',
  OWNER_VENUES: '/owner/venues',
  OWNER_VENUE_CREATE: '/owner/venues/new',
  OWNER_VENUE_EDIT: '/owner/venues/:id/edit',
  OWNER_COURTS: '/owner/courts',
  OWNER_BOOKINGS: '/owner/bookings',

  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
} as const;

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_SHORT: 'MMM dd',
  DISPLAY_WITH_DAY: 'EEE, MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd',
  TIME_DISPLAY: 'h:mm a',
  TIME_INPUT: 'HH:mm',
} as const;

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ============================================
// BOOKING RULES
// ============================================

export const BOOKING_RULES = {
  MIN_HOURS_BEFORE_BOOKING: 1, // Minimum hours before a booking can be made
  MAX_DAYS_IN_ADVANCE: 30, // Maximum days in advance for booking
  CANCELLATION_HOURS_BEFORE: 2, // Minimum hours before booking to cancel
  BOOKING_DURATION_MINUTES: 60, // Standard booking duration
  MAX_CONCURRENT_BOOKINGS: 5, // Max active bookings per user
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,

  // Phone
  PHONE_PATTERN: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,

  // Venue
  VENUE_NAME_MIN_LENGTH: 3,
  VENUE_NAME_MAX_LENGTH: 100,
  VENUE_DESCRIPTION_MAX_LENGTH: 1000,

  // Price
  MIN_PRICE_PER_HOUR: 0,
  MAX_PRICE_PER_HOUR: 10000,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  // Auth
  AUTH_REQUIRED: 'You must be signed in to perform this action',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_EMAIL_IN_USE: 'An account with this email already exists',
  AUTH_WEAK_PASSWORD: 'Password is too weak',
  AUTH_SESSION_EXPIRED: 'Your session has expired. Please sign in again',

  // Booking
  BOOKING_NOT_FOUND: 'Booking not found',
  BOOKING_ALREADY_BOOKED: 'This time slot is already booked',
  BOOKING_TOO_LATE: 'Booking must be made at least 1 hour in advance',
  BOOKING_TOO_FAR: 'Cannot book more than 30 days in advance',
  BOOKING_CANCELLATION_FAILED: 'Cannot cancel booking. It may be too late.',
  BOOKING_LIMIT_REACHED: 'You have reached the maximum number of active bookings',

  // Venue
  VENUE_NOT_FOUND: 'Venue not found',
  VENUE_NOT_ACTIVE: 'This venue is currently unavailable',
  VENUE_UNAUTHORIZED: 'You do not have permission to modify this venue',

  // Court
  COURT_NOT_FOUND: 'Court not found',
  COURT_NOT_ACTIVE: 'This court is currently unavailable',

  // General
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
  INVALID_INPUT: 'Please check your input and try again',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking confirmed!',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  VENUE_CREATED: 'Venue created successfully',
  VENUE_UPDATED: 'Venue updated successfully',
  VENUE_DELETED: 'Venue deleted successfully',
  COURT_CREATED: 'Court added successfully',
  COURT_UPDATED: 'Court updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// ============================================
// SPORT TYPE ICONS/EMOJIS
// ============================================

export const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
} as const;

export const SPORT_COLORS: Record<string, string> = {
  football: '#22c55e', // green
  badminton: '#3b82f6', // blue
  pickleball: '#f59e0b', // amber
} as const;

// ============================================
// AMENITY OPTIONS
// ============================================

export const COMMON_AMENITIES = {
  // General
  PARKING: 'Parking',
  WIFI: 'Free WiFi',
  RESTROOMS: 'Restrooms',
  SHOWERS: 'Showers',
  LOCKER_ROOMS: 'Locker Rooms',
  WATER_FOUNTAIN: 'Water Fountain',

  // Equipment
  EQUIPMENT_RENTAL: 'Equipment Rental',
  BALL_RENTAL: 'Ball Rental',
  RACKET_RENTAL: 'Racket Rental',

  // Lighting/Surface
  LIGHTING: 'Flood Lights',
  INDOOR: 'Indoor',
  OUTDOOR: 'Outdoor',
  AIR_CONDITIONED: 'Air Conditioned',

  // Seating
  SPECTATOR_SEATING: 'Spectator Seating',
  BENCHES: 'Player Benches',

  // Accessibility
  WHEELCHAIR_ACCESSIBLE: 'Wheelchair Accessible',
} as const;

export const SPORT_SPECIFIC_AMENITIES: Record<string, string[]> = {
  football: [
    'GOAL_POSTS',
    'GRASS_SURFACE',
    'ARTIFICIAL_TURF',
    'CHANGING_ROOMS',
  ],
  badminton: [
    'NON_SLIP_FLOOR',
    'MAT_SURFACE',
    'NET_HEIGHT_ADJUSTABLE',
    'SHUTTLE_COCK_RENTAL',
  ],
  pickleball: [
    'OUTDOOR_SURFACE',
    'INDOOR_SURFACE',
    'NET_INCLUDED',
    'PADDLE_RENTAL',
  ],
} as const;
