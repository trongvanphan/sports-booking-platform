/**
 * Venue Detail Page
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  MapPin,
  DollarSign,
  Star,
  Clock,
  Info,
  Calendar,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/BookingModal';
import type { Venue, Court } from '../../../../shared/types';

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
};

interface PageProps {
  params: { id: string };
}

async function getVenue(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('venues_with_owner')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function getCourts(venueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

export default async function VenueDetailPage({ params }: PageProps) {
  const venue = await getVenue(params.id);
  if (!venue) notFound();

  const courts = await getCourts(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/venues"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Venues
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-80 md:h-96 bg-gray-100">
        {venue.images && venue.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl">{SPORT_ICONS[venue.sport_type] || '🏟️'}</span>
          </div>
        )}
      </div>

      {/* Venue Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.city || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">4.5</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    ${venue.price_per_hour}
                  </div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {venue.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities */}
            {venue.amenities && venue.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Courts */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Available Courts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{court.name}</h3>
                      {court.type && (
                        <p className="text-sm text-gray-500">{court.type}</p>
                      )}
                    </div>
                    <BookingModal
                      venue={venue}
                      court={court}
                      trigger={
                        <Button size="sm">Book</Button>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            {venue.address && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </h2>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700">{venue.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Venue</h3>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Sport Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {venue.sport_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-medium text-gray-900">
                    ${venue.price_per_hour}/hour
                  </span>
                </div>
              </div>
              {courts.length > 0 ? (
                <BookingModal
                  venue={venue}
                  court={courts[0]}
                  trigger={
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  }
                />
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No courts available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
