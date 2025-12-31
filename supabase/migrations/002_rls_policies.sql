-- Sports Facility Booking Platform - Row Level Security Policies
-- Run this after 001_initial_schema.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- VENUES POLICIES
-- ============================================

-- Everyone can view active venues
CREATE POLICY "Active venues are viewable by everyone"
  ON venues FOR SELECT
  USING (is_active = true);

-- Venue owners can view their inactive venues
CREATE POLICY "Owners can view their venues"
  ON venues FOR SELECT
  USING (auth.uid() = owner_id);

-- Venue owners can insert venues
CREATE POLICY "Owners can create venues"
  ON venues FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Venue owners can update their venues
CREATE POLICY "Owners can update their venues"
  ON venues FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Venue owners can delete their venues
CREATE POLICY "Owners can delete their venues"
  ON venues FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- COURTS POLICIES
-- ============================================

-- Everyone can view active courts
CREATE POLICY "Active courts are viewable by everyone"
  ON courts FOR SELECT
  USING (is_active = true);

-- Venue owners can view all their courts (including inactive)
CREATE POLICY "Owners can view their courts"
  ON courts FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM venues WHERE id = courts.venue_id
    )
  );

-- Venue owners can insert courts for their venues
CREATE POLICY "Owners can create courts"
  ON courts FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT owner_id FROM venues WHERE id = venue_id
    )
  );

-- Venue owners can update their courts
CREATE POLICY "Owners can update their courts"
  ON courts FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT owner_id FROM venues WHERE id = venue_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT owner_id FROM venues WHERE id = venue_id
    )
  );

-- Venue owners can delete their courts
CREATE POLICY "Owners can delete their courts"
  ON courts FOR DELETE
  USING (
    auth.uid() IN (
      SELECT owner_id FROM venues WHERE id = venue_id
    )
  );

-- ============================================
-- TIME SLOTS POLICIES
-- ============================================

-- Everyone can view available time slots
CREATE POLICY "Available slots are viewable by everyone"
  ON time_slots FOR SELECT
  USING (
    is_available = true
    AND court_id IN (
      SELECT id FROM courts WHERE is_active = true
    )
  );

-- Venue owners can view all their time slots
CREATE POLICY "Owners can view their time slots"
  ON time_slots FOR SELECT
  USING (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = time_slots.court_id
    )
  );

-- Venue owners can insert time slots for their courts
CREATE POLICY "Owners can create time slots"
  ON time_slots FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = time_slots.court_id
    )
  );

-- Venue owners can update their time slots
CREATE POLICY "Owners can update their time slots"
  ON time_slots FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = time_slots.court_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = time_slots.court_id
    )
  );

-- Venue owners can delete their time slots
CREATE POLICY "Owners can delete their time slots"
  ON time_slots FOR DELETE
  USING (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = time_slots.court_id
    )
  );

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Venue owners can view bookings for their venues
CREATE POLICY "Owners can view venue bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() IN (
      SELECT v.owner_id FROM courts c JOIN venues v ON v.id = c.venue_id WHERE c.id = bookings.court_id
    )
  );

-- Users can create bookings
CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (for cancellation)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VIEWS POLICIES (for security views)
-- ============================================

-- Grant access to views
GRANT SELECT ON venues_with_owner TO authenticated;
GRANT SELECT ON bookings_with_details TO authenticated;

-- ============================================
-- STORAGE POLICIES (if using Supabase Storage)
-- ============================================

-- Note: Create a bucket named 'venue-images' in Supabase Storage first
-- These policies will be applied after bucket creation

-- Allow public access to venue images
-- CREATE POLICY "Venue images are publicly viewable"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'venue-images');

-- Allow venue owners to upload images
-- CREATE POLICY "Owners can upload venue images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'venue-images'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Allow venue owners to delete their images
-- CREATE POLICY "Owners can delete venue images"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'venue-images'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================
-- HELPER FUNCTIONS FOR PERMISSIONS
-- ============================================

-- Function to check if user is a venue owner
CREATE OR REPLACE FUNCTION is_owner(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINer;

-- Function to check if user owns a specific venue
CREATE OR REPLACE FUNCTION owns_venue(venue_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id AND owner_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's venues
CREATE OR REPLACE FUNCTION get_my_venues()
RETURNS TABLE (
  id UUID,
  name TEXT,
  sport_type TEXT,
  city TEXT,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.id, v.name, v.sport_type, v.city, v.is_active
  FROM venues v
  WHERE v.owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
