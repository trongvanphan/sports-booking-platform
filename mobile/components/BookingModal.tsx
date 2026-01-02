/**
 * Booking Modal - Time slot selection and confirmation
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { X, Calendar, Clock, DollarSign } from 'lucide-react-native';
import { db } from '../lib/supabase';
import { useBookingStore, useAuthStore } from '../lib/store';
import type { Venue, Court, TimeSlot } from '../../shared/types';

interface BookingModalProps {
  visible: boolean;
  venue: Venue | null;
  courts: Court[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({
  visible,
  venue,
  courts,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { selectedCourt, setSelectedDate, selectedSlot } = useBookingStore();
  const { user } = useAuthStore();

  const [selectedDate, setLocalSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const selectedCourtData = courts.find((c) => c.id === selectedCourt?.id);

  useEffect(() => {
    if (visible && venue) {
      loadAvailableSlots();
    }
  }, [visible, selectedDate, selectedCourt, venue]);

  const loadAvailableSlots = async () => {
    if (!venue || !selectedCourt) return;

    setLoadingSlots(true);
    try {
      const slots = await db.getAvailableSlots(venue.id, selectedDate);
      // Filter by selected court
      const courtSlots = slots.filter((s) => s.court_id === selectedCourt.id);
      setAvailableSlots(courtSlots as TimeSlot[]);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlotId || !selectedCourt) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    setBooking(true);
    try {
      const slot = availableSlots.find((s) => s.id === selectedSlotId);
      await db.createBooking({
        user_id: user?.id || '',
        court_id: selectedCourt.id,
        time_slot_id: selectedSlotId,
        total_price: slot?.price || venue?.price_per_hour,
        special_requests: specialRequests || null,
      });

      Alert.alert('Success', 'Booking confirmed!', [
        {
          text: 'OK',
          onPress: onSuccess,
        },
      ]);
    } catch (error: unknown) {
      const err = error as { message?: string };
      Alert.alert('Error', err.message || 'Failed to create booking');
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

  const selectedSlotData = availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Book {venue?.name}</Text>
              <Text style={styles.subtitle}>{selectedCourtData?.name}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Date Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesContainer}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = dateStr === selectedDate;

                  return (
                    <TouchableOpacity
                      key={dateStr}
                      style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                      onPress={() => setLocalSelectedDate(dateStr)}
                    >
                      <Text
                        style={[
                          styles.dateDay,
                          isSelected && styles.dateTextSelected,
                        ]}
                      >
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <Text
                        style={[
                          styles.dateNumber,
                          isSelected && styles.dateTextSelected,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Time Slots */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Time</Text>
              {loadingSlots ? (
                <View style={styles.center}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : availableSlots.length === 0 ? (
                <Text style={styles.emptyText}>No available slots for this date</Text>
              ) : (
                <View style={styles.slotsGrid}>
                  {availableSlots.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    return (
                      <TouchableOpacity
                        key={slot.id}
                        style={[styles.slotCard, isSelected && styles.slotCardSelected]}
                        onPress={() => setSelectedSlotId(slot.id)}
                      >
                        <Clock size={16} color={isSelected ? '#fff' : '#3b82f6'} />
                        <Text
                          style={[styles.slotTime, isSelected && styles.slotTextSelected]}
                        >
                          {formatTime(slot.start_time)}
                        </Text>
                        <Text
                          style={[styles.slotPrice, isSelected && styles.slotTextSelected]}
                        >
                          ${slot.price}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Special Requests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Any special requirements..."
                value={specialRequests}
                onChangeText={setSpecialRequests}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Summary */}
            {selectedSlotData && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Venue</Text>
                  <Text style={styles.summaryValue}>{venue?.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Court</Text>
                  <Text style={styles.summaryValue}>{selectedCourtData?.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>
                    {formatTime(selectedSlotData.start_time)} -{' '}
                    {formatTime(selectedSlotData.end_time)}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotal}>Total</Text>
                  <Text style={styles.summaryTotal}>
                    ${selectedSlotData.price}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!selectedSlotId || booking) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmBooking}
              disabled={!selectedSlotId || booking}
            >
              {booking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  datesContainer: {
    gap: 12,
  },
  dateCard: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateCardSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dateDay: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dateTextSelected: {
    color: '#fff',
  },
  center: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotCardSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  slotTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  slotPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  slotTextSelected: {
    color: '#fff',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 80,
  },
  summary: {
    padding: 20,
    backgroundColor: '#f9fafb',
    margin: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
