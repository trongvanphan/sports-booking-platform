/**
 * Owner Dashboard Page
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getOwnerVenues(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function getOwnerBookings(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings_with_details')
    .select('*')
    .eq('venue_id', `in (select id from venues where owner_id = ${userId})`)
    .order('date', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export default async function OwnerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user is owner
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'owner') {
    redirect('/');
  }

  const [venues, bookings] = await Promise.all([
    getOwnerVenues(user.id),
    getOwnerBookings(user.id),
  ]);

  const totalRevenue = bookings?.reduce(
    (sum, b) => sum + (b.total_price || 0),
    0
  ) || 0;

  const upcomingBookings = bookings?.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600">Manage your venues and bookings</p>
            </div>
            <Link href="/owner/venues/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Venues
              </CardTitle>
              <Building2 className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venues?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venues */}
          <Card>
            <CardHeader>
              <CardTitle>My Venues</CardTitle>
            </CardHeader>
            <CardContent>
              {venues && venues.length > 0 ? (
                <div className="space-y-4">
                  {venues.map((venue) => (
                    <div
                      key={venue.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {venue.sport_type} • ${venue.price_per_hour}/hour
                        </p>
                      </div>
                      <Link
                        href={`/owner/venues/${venue.id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No venues yet</p>
                  <Link href="/owner/venues/new">
                    <Button>Add Your First Venue</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Link href="/owner/bookings" className="text-blue-600 hover:underline text-sm">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {booking.venue_name}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.court_name}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${booking.total_price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No bookings yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
