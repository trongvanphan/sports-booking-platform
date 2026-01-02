/**
 * Explore/Home Tab Screen - Venue Listing
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { db } from '../../lib/supabase';
import { useVenueStore, useFilterStore } from '../../lib/store';
import type { Venue } from '../../../shared/types';

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  badminton: '🏸',
  pickleball: '🎾',
};

const SPORT_COLORS: Record<string, string> = {
  football: '#22c55e',
  badminton: '#3b82f6',
  pickleball: '#f59e0b',
};

export function ExploreScreen() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { setSelectedVenue } = useVenueStore();
  const { sportType, setSportType } = useFilterStore();

  const loadVenues = async () => {
    try {
      const data = await db.getVenues({
        sport_type: sportType === 'all' ? undefined : sportType,
        is_active: true,
      });
      setVenues(data as Venue[]);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, [sportType]);

  const onRefresh = () => {
    setRefreshing(true);
    loadVenues();
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase()) ||
    venue.city?.toLowerCase().includes(search.toLowerCase()) ||
    venue.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Venues</Text>
        <Text style={styles.subtitle}>Discover sports facilities near you</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search venues, cities..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Sport Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {['all', 'football', 'badminton', 'pickleball'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              sportType === type && styles.filterChipActive,
            ]}
            onPress={() => setSportType(type as typeof sportType)}
          >
            <Text style={styles.filterEmoji}>{SPORT_ICONS[type] || '🏟️'}</Text>
            <Text
              style={[
                styles.filterText,
                sportType === type && styles.filterTextActive,
              ]}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Venue List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : filteredVenues.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No venues found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.venueList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredVenues.map((venue) => (
            <TouchableOpacity
              key={venue.id}
              style={styles.venueCard}
              onPress={() => {
                setSelectedVenue(venue);
                router.push(`/venue/${venue.id}`);
              }}
            >
              {/* Venue Image */}
              <View style={styles.venueImageContainer}>
                {venue.images && venue.images.length > 0 ? (
                  <Image
                    source={{ uri: venue.images[0] }}
                    style={styles.venueImage}
                  />
                ) : (
                  <View style={[styles.venueImage, styles.venueImagePlaceholder]}>
                    <Text style={styles.venueImageText}>
                      {SPORT_ICONS[venue.sport_type] || '🏟️'}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.sportBadge,
                    { backgroundColor: SPORT_COLORS[venue.sport_type] },
                  ]}
                >
                  <Text style={styles.sportBadgeText}>
                    {SPORT_ICONS[venue.sport_type]} {venue.sport_type}
                  </Text>
                </View>
              </View>

              {/* Venue Info */}
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <Text style={styles.venueAddress} numberOfLines={1}>
                  {venue.address || 'No address'}
                </Text>
                <View style={styles.venueMeta}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${venue.price_per_hour}</Text>
                    <Text style={styles.priceLabel}>/hour</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ 4.5</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  filtersContainer: {
    paddingLeft: 16,
    marginBottom: 8,
  },
  filtersContent: {
    paddingRight: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterEmoji: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  venueList: {
    flex: 1,
    padding: 16,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  venueImageContainer: {
    position: 'relative',
    height: 160,
  },
  venueImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  venueImagePlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueImageText: {
    fontSize: 48,
  },
  sportBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sportBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  venueInfo: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  venueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingContainer: {},
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
