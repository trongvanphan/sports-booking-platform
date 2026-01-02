/**
 * Database types generated from Supabase schema
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'user' | 'owner'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'owner'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'owner'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          sport_type: 'football' | 'badminton' | 'pickleball'
          address: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          images: string[]
          amenities: string[]
          price_per_hour: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          sport_type: 'football' | 'badminton' | 'pickleball'
          address?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          amenities?: string[]
          price_per_hour: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          sport_type?: 'football' | 'badminton' | 'pickleball'
          address?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          amenities?: string[]
          price_per_hour?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          venue_id: string
          name: string
          type: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          name: string
          type?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          name?: string
          type?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          is_available: boolean
          price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          is_available?: boolean
          price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          date?: string
          start_time?: string
          end_time?: string
          is_available?: boolean
          price?: number | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          court_id: string
          time_slot_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number | null
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id: string
          time_slot_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string
          time_slot_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number | null
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      venues_with_owner: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          sport_type: 'football' | 'badminton' | 'pickleball'
          address: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          images: string[]
          amenities: string[]
          price_per_hour: number
          is_active: boolean
          created_at: string
          updated_at: string
          owner_name: string | null
          owner_phone: string | null
          owner_avatar: string | null
        }
      }
      bookings_with_details: {
        Row: {
          id: string
          user_id: string
          court_id: string
          time_slot_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number | null
          special_requests: string | null
          created_at: string
          updated_at: string
          user_name: string | null
          user_phone: string | null
          court_name: string | null
          court_type: string | null
          venue_name: string | null
          sport_type: 'football' | 'badminton' | 'pickleball' | null
          venue_address: string | null
          date: string
          start_time: string
          end_time: string
        }
      }
    }
    Functions: {
      get_available_slots: {
        Args: {
          p_venue_id: string
          p_date: string
        }
        Returns: {
          slot_id: string
          court_id: string
          court_name: string
          start_time: string
          end_time: string
          price: number
        }[]
      }
      generate_time_slots: {
        Args: {
          p_court_id: string
          p_start_date: string
          p_end_date: string
          p_slot_interval?: string
          p_start_time?: string
          p_end_time?: string
        }
        Returns: number
      }
    }
    Enums: {
      // Add any enums if defined in your schema
    }
  }
}
