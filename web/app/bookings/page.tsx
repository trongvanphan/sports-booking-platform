/**
 * My Bookings Page (User)
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  X,
  ChevronLeft,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

async function getUserBookings(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings_with_details')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data;
}

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const bookings = await getUserBookings(user.id);

  const upcomingBookings = bookings?.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  ) || [];

  const pastBookings = bookings?.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  ) || [];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const STATUS_STYLES = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings && bookings.length > 0 ? (
          <>
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
                <div className="space-y-4 mb-8">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.venue_name}
                            </h3>
                            <p className="text-gray-600">{booking.court_name}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              STATUS_STYLES[booking.status as keyof typeof STATUS_STYLES]
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">${booking.total_price}</span>
                          </div>
                        </div>

                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel Booking
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past</h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.venue_name}
                            </h3>
                            <p className="text-gray-600">{booking.court_name}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              STATUS_STYLES[booking.status as keyof typeof STATUS_STYLES]
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">${booking.total_price}</span>
                          </div>
                        </div>

                        {booking.status === 'completed' && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Star className="w-4 h-4" />
                              Leave a Review
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                Start by booking a venue for your next game!
              </p>
              <Link href="/venues">
                <Button>Browse Venues</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
