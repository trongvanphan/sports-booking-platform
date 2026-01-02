/**
 * Venues Listing Page
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Search, MapPin, DollarSign, Star, SlidersHorizontal } from 'lucide-react';
import { VenueCard } from '@/components/VenueCard';
import { Button } from '@/components/ui/button';

interface SearchParams {
  searchParams: { sport?: string; city?: string; search?: string };
}

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
};

const SPORT_LABELS: Record<string, string> = {
  football: 'Football',
  badminton: 'Badminton',
  pickleball: 'Pickleball',
};

const SPORT_COLORS: Record<string, string> = {
  football: 'bg-green-100 text-green-700',
  badminton: 'bg-blue-100 text-blue-700',
  pickleball: 'bg-amber-100 text-amber-700',
};

async function getVenues(sportType?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (sportType && sportType !== 'all') {
    query = query.eq('sport_type', sportType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export default async function VenuesPage({ searchParams }: SearchParams) {
  const sportType = searchParams.sport || 'all';
  const venues = await getVenues(sportType === 'all' ? undefined : sportType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Venues</h1>
          <p className="text-gray-600">Discover sports facilities near you</p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search venues, cities..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Sport Type Filter */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            <Link
              href="/venues?sport=all"
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                sportType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Sports
            </Link>
            {['football', 'badminton', 'pickleball'].map((sport) => (
              <Link
                key={sport}
                href={`/venues?sport=${sport}`}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  sportType === sport
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{SPORT_ICONS[sport]}</span>
                {SPORT_LABELS[sport]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="container mx-auto px-4 py-8">
        {venues && venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏟️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
