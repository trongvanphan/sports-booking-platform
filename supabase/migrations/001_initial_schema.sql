-- Sports Facility Booking Platform - Initial Schema
-- Run this migration in Supabase SQL Editor or via CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional fields
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('user', 'owner')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VENUES TABLE
-- Sports facilities (football stadiums, badminton courts, etc.)
-- ============================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sport_type TEXT CHECK (sport_type IN ('football', 'badminton', 'pickleball')) NOT NULL,
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  price_per_hour DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURTS TABLE
-- Individual courts/fields within a venue
-- ============================================
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT, -- e.g., "Indoor", "Outdoor", "Court 1", "Field A"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TIME SLOTS TABLE
-- Available booking time slots for each court
-- ============================================
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price DECIMAL(10, 2), -- NULL means use venue default price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(court_id, date, start_time)
);

-- ============================================
-- BOOKINGS TABLE
-- User bookings for time slots
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  total_price DECIMAL(10, 2),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- Improve query performance
-- ============================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);

-- Venues indexes
CREATE INDEX idx_venues_owner ON venues(owner_id);
CREATE INDEX idx_venues_sport_type ON venues(sport_type);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_active ON venues(is_active);
CREATE INDEX idx_venues_location ON venues(latitude, longitude);

-- Courts indexes
CREATE INDEX idx_courts_venue ON courts(venue_id);
CREATE INDEX idx_courts_active ON courts(is_active);

-- Time slots indexes
CREATE INDEX idx_time_slots_court ON time_slots(court_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
CREATE INDEX idx_time_slots_court_date ON time_slots(court_id, date);

-- Bookings indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- Auto-update updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON courts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::text, 'user')::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Create time slots for a court
-- Helper function to generate time slots
-- ============================================

CREATE OR REPLACE FUNCTION generate_time_slots(
  p_court_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_slot_interval INTERVAL DEFAULT '1 hour',
  p_start_time TIME DEFAULT '06:00',
  p_end_time TIME DEFAULT '22:00'
)
RETURNS INT AS $$
DECLARE
  loop_date DATE := p_start_date;
  loop_time TIME := p_start_time;
  slots_created INT := 0;
BEGIN
  WHILE loop_date <= p_end_date LOOP
    loop_time := p_start_time;
    WHILE loop_time + p_slot_interval <= p_end_time LOOP
      INSERT INTO time_slots (court_id, date, start_time, end_time)
      VALUES (p_court_id, loop_date, loop_time, loop_time + p_slot_interval)
      ON CONFLICT (court_id, date, start_time) DO NOTHING;

      IF FOUND THEN
        slots_created := slots_created + 1;
      END IF;

      loop_time := loop_time + p_slot_interval;
    END LOOP;
    loop_date := loop_date + 1;
  END LOOP;

  RETURN slots_created;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get available slots for venue
-- ============================================

CREATE OR REPLACE FUNCTION get_available_slots(
  p_venue_id UUID,
  p_date DATE
)
RETURNS TABLE (
  slot_id UUID,
  court_id UUID,
  court_name TEXT,
  start_time TIME,
  end_time TIME,
  price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ts.id,
    ts.court_id,
    c.name AS court_name,
    ts.start_time,
    ts.end_time,
    COALESCE(ts.price, v.price_per_hour) AS price
  FROM time_slots ts
  JOIN courts c ON c.id = ts.court_id
  JOIN venues v ON v.id = c.venue_id
  WHERE ts.court_id IN (SELECT id FROM courts WHERE venue_id = p_venue_id AND is_active = true)
    AND ts.date = p_date
    AND ts.is_available = true
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.time_slot_id = ts.id
        AND b.status IN ('confirmed', 'pending')
    )
  ORDER BY c.name, ts.start_time;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- View: Venues with owner info
CREATE OR REPLACE VIEW venues_with_owner AS
SELECT
  v.*,
  p.full_name AS owner_name,
  p.phone AS owner_phone,
  p.avatar_url AS owner_avatar
FROM venues v
JOIN profiles p ON p.id = v.owner_id;

-- View: Bookings with details
CREATE OR REPLACE VIEW bookings_with_details AS
SELECT
  b.*,
  u.full_name AS user_name,
  u.phone AS user_phone,
  c.name AS court_name,
  c.type AS court_type,
  v.name AS venue_name,
  v.sport_type,
  v.address AS venue_address,
  ts.date,
  ts.start_time,
  ts.end_time
FROM bookings b
JOIN profiles u ON u.id = b.user_id
JOIN courts c ON c.id = b.court_id
JOIN venues v ON v.id = c.venue_id
JOIN time_slots ts ON ts.id = b.time_slot_id;
