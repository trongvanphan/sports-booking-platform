/**
 * Venue Detail Screen
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  ChevronLeft,
  Calendar,
  Info,
} from 'lucide-react-native';
import { db } from '../../lib/supabase';
import { useVenueStore, useBookingStore, useAuthStore } from '../../lib/store';
import type { Venue, Court, TimeSlot } from '../../../shared/types';
import { BookingModal } from '../../components/BookingModal';

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
};

export function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { selectedVenue, setSelectedVenue } = useVenueStore();
  const { isAuthenticated } = useAuthStore();
  const [venue, setVenue] = useState<Venue | null>(selectedVenue);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    loadVenueData();
  }, [id]);

  const loadVenueData = async () => {
    try {
      setLoading(true);
      const venueData = await db.getVenueById(id as string);
      setVenue(venueData as Venue);

      const courtsData = await db.getCourtsByVenue(id as string);
      setCourts(courtsData as Court[]);
    } catch (error) {
      console.error('Error loading venue:', error);
      Alert.alert('Error', 'Failed to load venue details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book this venue',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/signin') },
        ]
      );
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Venue not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageCarousel}
        >
          {venue.images && venue.images.length > 0 ? (
            venue.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.venueImage} />
            ))
          ) : (
            <View style={styles.venueImagePlaceholder}>
              <Text style={styles.venueImagePlaceholderText}>
                {SPORT_ICONS[venue.sport_type] || '🏟️'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Venue Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.metaText}>{venue.city || 'No location'}</Text>
            </View>
            <View style={styles.metaItem}>
              <DollarSign size={16} color="#6b7280" />
              <Text style={styles.metaText}>
                ${venue.price_per_hour}/hour
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {venue.description || 'No description available.'}
          </Text>

          {/* Amenities */}
          {venue.amenities && venue.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {venue.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityBadge}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Courts */}
          <Text style={styles.sectionTitle}>Available Courts</Text>
          {courts.map((court) => (
            <View key={court.id} style={styles.courtCard}>
              <View>
                <Text style={styles.courtName}>{court.name}</Text>
                {court.type && (
                  <Text style={styles.courtType}>{court.type}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => {
                  useBookingStore.setState({ selectedCourt: court });
                  handleBookNow();
                }}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Address */}
          {venue.address && (
            <>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.addressContainer}>
                <MapPin size={20} color="#3b82f6" />
                <Text style={styles.addressText}>{venue.address}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.price}>${venue.price_per_hour}</Text>
          <Text style={styles.priceLabel}>per hour</Text>
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={handleBookNow}>
          <Text style={styles.ctaButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        venue={venue}
        courts={courts}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => {
          setShowBookingModal(false);
          router.push('/(tabs)/bookings');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  imageCarousel: {
    height: 250,
  },
  venueImage: {
    width: 375,
    height: 250,
    resizeMode: 'cover',
  },
  venueImagePlaceholder: {
    width: 375,
    height: 250,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueImagePlaceholderText: {
    fontSize: 64,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  courtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  courtName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  courtType: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  ctaButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
