/**
 * Venue Card Component
 */

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, DollarSign, Star } from 'lucide-react';
import type { Venue } from '../../../shared/types';

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
};

const SPORT_COLORS: Record<string, string> = {
  football: 'bg-green-100 text-green-700',
  badminton: 'bg-blue-100 text-blue-700',
  pickleball: 'bg-amber-100 text-amber-700',
};

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
    >
      {/* Venue Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {venue.images && venue.images.length > 0 ? (
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-6xl">{SPORT_ICONS[venue.sport_type] || '🏟️'}</span>
          </div>
        )}

        {/* Sport Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${
            SPORT_COLORS[venue.sport_type]
          }`}
        >
          {SPORT_ICONS[venue.sport_type]} {venue.sport_type}
        </div>
      </div>

      {/* Venue Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {venue.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{venue.city || 'No location'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">4.5</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-gray-700" />
            <span className="text-xl font-bold text-gray-900">${venue.price_per_hour}</span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
          <span className="text-sm text-blue-600 font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
