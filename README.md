# SportBook - Sports Facility Booking Platform

A cross-platform mobile app and web application for booking sports facilities (football stadiums, badminton courts, pickleball courts).

## Project Structure

```
sports-booking-platform/
├── mobile/              # React Native Expo app (iOS & Android)
│   ├── app/             # Expo Router screens
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities, Supabase client, stores
│   └── screens/         # Auth screens
├── web/                 # Next.js 14 web application
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   └── lib/             # Utilities, Supabase clients
├── supabase/            # Database migrations and edge functions
├── shared/              # Shared TypeScript types and constants
└── README.md
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Mobile App** | React Native + Expo, TypeScript, Zustand, Expo Router |
| **Web App** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Real-time) |

## Features

### User Features
- Browse and search sports venues
- Filter by sport type (football, badminton, pickleball)
- View venue details with photos and amenities
- Book available time slots
- Manage personal bookings (view, cancel)
- View booking history

### Venue Owner Features
- Register and manage venues
- Add courts/fields to venues
- Set availability and pricing
- View dashboard with stats
- Manage incoming bookings

## Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))
- For mobile: Expo Go app on iOS/Android device

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Project Settings > API
3. Copy your project URL and anon key

### 2. Run Database Migrations

1. In Supabase Dashboard, go to SQL Editor
2. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

### 3. Set Up Environment Variables

#### Mobile App (.env)
```bash
cp mobile/.env.example mobile/.env
```

Edit `mobile/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Web App (.env.local)
```bash
cp web/.env.example web/.env.local
```

Edit `web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install Dependencies & Run

#### Web Application
```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Mobile App
```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code with Expo Go app on your phone.

## Implementation Status

### Completed ✅

**Mobile (Expo/React Native)**
- [x] Project setup with Expo Router
- [x] Supabase integration
- [x] Zustand state management
- [x] Authentication screens (Sign In, Sign Up)
- [x] Explore/Home tab with venue listing
- [x] Venue detail screen
- [x] Booking modal with time slot selection
- [x] My Bookings tab
- [x] Profile tab with user info

**Web (Next.js)**
- [x] Project setup with App Router
- [x] Supabase SSR integration
- [x] Middleware for auth protection
- [x] Landing page
- [x] Authentication pages (Sign In, Sign Up)
- [x] Venues listing page
- [x] Venue detail page
- [x] Booking modal
- [x] My Bookings page
- [x] Owner Dashboard
- [x] Create Venue form (owner)
- [x] UI components (Button, Card, Input, Dialog, Alert)

**Database**
- [x] Complete schema with all tables
- [x] Row Level Security policies
- [x] Helper functions (get_available_slots, generate_time_slots)
- [x] Database functions and triggers

**Shared**
- [x] TypeScript types
- [x] Constants

### Future Enhancements 🚧

**Phase 2 Features**
- [ ] Owner venue editing
- [ ] Court management (add/edit/delete)
- [ ] Time slot management
- [ ] Booking calendar view for owners
- [ ] Accept/reject booking functionality

**Phase 3 Features**
- [ ] Push notifications
- [ ] Reviews and ratings
- [ ] Advanced search and filters
- [ ] User profile editing
- [ ] Dark mode support

**Phase 4 Features**
- [ ] Payment integration (Stripe)
- [ ] Recurring bookings
- [ ] Waitlist functionality
- [ ] Dynamic pricing
- [ ] Analytics dashboard
- [ ] Multi-language support

## Database Schema

### Main Tables
- `profiles` - User profiles extending Supabase auth
- `venues` - Sports facilities
- `courts` - Individual courts/fields within venues
- `time_slots` - Available booking time slots
- `bookings` - Booking records with status tracking

## Routes

### Mobile Routes
- `/` - Explore (Home)
- `/bookings` - My Bookings
- `/profile` - User Profile
- `/venue/:id` - Venue Details
- `/auth/signin` - Sign In
- `/auth/signup` - Sign Up

### Web Routes
- `/` - Home/Landing
- `/venues` - Venue Listing
- `/venues/:id` - Venue Details
- `/bookings` - My Bookings
- `/auth/signin` - Sign In
- `/auth/signup` - Sign Up
- `/owner` - Owner Dashboard
- `/owner/venues/new` - Create Venue
- `/profile` - User Profile (planned)

## License

MIT License - feel free to use this project for learning or building your own platform.
