/**
 * Supabase client configuration for mobile app
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      // For React Native, we need to use AsyncStorage
      // This will be configured when we install @react-native-async-storage/async-storage
      // For now, using default storage which works in Expo Go
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database helper functions
export const db = {
  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Venues
  async getVenues(filters?: {
    sport_type?: string;
    city?: string;
    is_active?: boolean;
  }) {
    let query = supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.sport_type) {
      query = query.eq('sport_type', filters.sport_type);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getVenueById(venueId: string) {
    const { data, error } = await supabase
      .from('venues_with_owner')
      .select('*')
      .eq('id', venueId)
      .single();

    if (error) throw error;
    return data;
  },

  async getMyVenues(ownerId: string) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createVenue(venue: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateVenue(venueId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', venueId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteVenue(venueId: string) {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId);

    if (error) throw error;
  },

  // Courts
  async getCourtsByVenue(venueId: string) {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('venue_id', venueId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async createCourt(court: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('courts')
      .insert(court)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourt(courtId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('courts')
      .update(updates)
      .eq('id', courtId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCourt(courtId: string) {
    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', courtId);

    if (error) throw error;
  },

  // Time Slots
  async getAvailableSlots(venueId: string, date: string) {
    const { data, error } = await supabase
      .rpc('get_available_slots', { p_venue_id: venueId, p_date: date });

    if (error) throw error;
    return data;
  },

  async generateTimeSlots(
    courtId: string,
    startDate: string,
    endDate: string,
    slotInterval: string = '01:00:00',
    startTime: string = '06:00',
    endTime: string = '22:00'
  ) {
    const { data, error } = await supabase
      .rpc('generate_time_slots', {
        p_court_id: courtId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_slot_interval: slotInterval,
        p_start_time: startTime,
        p_end_time: endTime,
      });

    if (error) throw error;
    return data;
  },

  // Bookings
  async getMyBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings_with_details')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getVenueBookings(venueId: string) {
    const { data, error } = await supabase
      .from('bookings_with_details')
      .select('*')
      .eq('venue_id', venueId)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBookingById(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings_with_details')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  async createBooking(booking: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBooking(bookingId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancelBooking(bookingId: string) {
    return this.updateBooking(bookingId, { status: 'cancelled' });
  },
};

// Auth helper functions
export const auth = {
  async signUp(email: string, password: string, metadata: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Real-time subscriptions
export const subscribeTo = {
  bookings(venueId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel(`bookings:${venueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `court_id=in.(select id from courts where venue_id=${venueId})`,
        },
        callback
      )
      .subscribe();
  },

  timeSlots(courtId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel(`time_slots:${courtId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_slots',
          filter: `court_id=eq.${courtId}`,
        },
        callback
      )
      .subscribe();
  },
};
