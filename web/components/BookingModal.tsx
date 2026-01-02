/**
 * Booking Modal Component
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, DollarSign, Loader2 } from 'lucide-react';
import type { Venue, Court, TimeSlot } from '../../../shared/types';

interface BookingModalProps {
  venue: Venue;
  court: Court;
  trigger: React.ReactNode;
}

export function BookingModal({ venue, court, trigger }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  useEffect(() => {
    if (open) {
      loadAvailableSlots();
    }
  }, [open, selectedDate]);

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .rpc('get_available_slots', {
          p_venue_id: venue.id,
          p_date: selectedDate,
        });

      if (error) throw error;

      // Filter by selected court
      const courtSlots = data?.filter((s: TimeSlot) => s.court_id === court.id) || [];
      setAvailableSlots(courtSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (!selectedSlotId) {
      return;
    }

    setBooking(true);
    try {
      const slot = availableSlots.find((s) => s.id === selectedSlotId);

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        court_id: court.id,
        time_slot_id: selectedSlotId,
        total_price: slot?.price || venue.price_per_hour,
        special_requests: specialRequests || null,
      });

      if (error) throw error;

      setOpen(false);
      router.push('/bookings');
      router.refresh();
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert(err.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const selectedSlot = availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {venue.name}</DialogTitle>
            <DialogDescription>{court.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label>Select Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-2"
              />
            </div>

            {/* Time Slots */}
            <div>
              <Label>Select Time</Label>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No available slots for this date
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        selectedSlotId === slot.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg font-semibold">
                        {formatTime(slot.start_time)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${slot.price}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <Label>Special Requests (Optional)</Label>
              <textarea
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any special requirements..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {/* Summary */}
            {selectedSlot && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="font-semibold">Booking Summary</div>
                <div className="flex justify-between text-sm">
                  <span>Date</span>
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time</span>
                  <span>
                    {formatTime(selectedSlot.start_time)} -{' '}
                    {formatTime(selectedSlot.end_time)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Court</span>
                  <span>{court.name}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${selectedSlot.price}</span>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              className="w-full"
              onClick={handleConfirmBooking}
              disabled={!selectedSlotId || booking}
            >
              {booking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
