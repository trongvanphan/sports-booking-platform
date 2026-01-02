/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import type { Profile, Venue, Court, TimeSlot, Booking } from '../../shared/types';

// ============================================
// AUTH STORE
// ============================================

interface AuthState {
  user: Profile | null;
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: Profile | null, session: string | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  setAuth: (user, session) => set({ user, session, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  signOut: () => set({ user: null, session: null, isAuthenticated: false }),
}));

// ============================================
// VENUE STORE
// ============================================

interface VenueState {
  venues: Venue[];
  selectedVenue: Venue | null;
  selectedCourt: Court | null;
  isLoading: boolean;
  error: string | null;
  setVenues: (venues: Venue[]) => void;
  setSelectedVenue: (venue: Venue | null) => void;
  setSelectedCourt: (court: Court | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  venues: [],
  selectedVenue: null,
  selectedCourt: null,
  isLoading: false,
  error: null,
  setVenues: (venues) => set({ venues }),
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),
  setSelectedCourt: (court) => set({ selectedCourt: court }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// ============================================
// BOOKING STORE
// ============================================

interface BookingState {
  bookings: Booking[];
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  isLoading: boolean;
  error: string | null;
  setBookings: (bookings: Booking[]) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedDate: null,
  selectedSlot: null,
  isLoading: false,
  error: null,
  setBookings: (bookings) => set({ bookings }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
}));

// ============================================
// FILTER STORE
// ============================================

interface FilterState {
  sportType: 'football' | 'badminton' | 'pickleball' | 'all';
  city: string;
  date: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  setSportType: (type: 'football' | 'badminton' | 'pickleball' | 'all') => void;
  setCity: (city: string) => void;
  setDate: (date: string | null) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  sportType: 'all',
  city: '',
  date: null,
  minPrice: null,
  maxPrice: null,
  setSportType: (type) => set({ sportType: type }),
  setCity: (city) => set({ city }),
  setDate: (date) => set({ date }),
  setMinPrice: (price) => set({ minPrice: price }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  resetFilters: () =>
    set({
      sportType: 'all',
      city: '',
      date: null,
      minPrice: null,
      maxPrice: null,
    }),
}));

// ============================================
// OWNER STORE
// ============================================

interface OwnerState {
  myVenues: Venue[];
  selectedVenueForEdit: Venue | null;
  isCreatingVenue: boolean;
  isEditingVenue: boolean;
  setMyVenues: (venues: Venue[]) => void;
  setSelectedVenueForEdit: (venue: Venue | null) => void;
  setCreatingVenue: (creating: boolean) => void;
  setEditingVenue: (editing: boolean) => void;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  myVenues: [],
  selectedVenueForEdit: null,
  isCreatingVenue: false,
  isEditingVenue: false,
  setMyVenues: (venues) => set({ myVenues: venues }),
  setSelectedVenueForEdit: (venue) => set({ selectedVenueForEdit: venue }),
  setCreatingVenue: (creating) => set({ isCreatingVenue: creating }),
  setEditingVenue: (editing) => set({ isEditingVenue: editing }),
}));
