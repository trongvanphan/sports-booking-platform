/**
 * Profile Tab Screen
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react-native';
import { useAuthStore } from '../../lib/store';
import { auth, db } from '../../lib/supabase';

export function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [venuesCount, setVenuesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user?.role === 'owner') {
        const venues = await db.getMyVenues(user.id);
        setVenuesCount(venues.length);
      }
      const bookings = await db.getMyBookings(user.id);
      setBookingsCount(bookings.length);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await auth.signOut();
            signOut();
            router.replace('/auth/signin');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const menuItems = [
    {
      icon: User,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: () => router.push('/profile/edit'),
    },
    ...(user.role === 'owner'
      ? [
          {
            icon: Building2,
            title: 'My Venues',
            subtitle: `${venuesCount} venue${venuesCount !== 1 ? 's' : ''}`,
            action: () => router.push('/owner'),
          },
        ]
      : []),
    {
      icon: MapPin,
      title: 'My Bookings',
      subtitle: `${bookingsCount} booking${bookingsCount !== 1 ? 's' : ''}`,
      action: () => router.push('/(tabs)/bookings'),
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      action: () => router.push('/settings'),
    },
    {
      icon: LogOut,
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      action: handleSignOut,
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#fff" />
            </View>
          )}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user.role === 'owner' ? '🏢 Owner' : '👤 User'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user.full_name || 'User'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Stats for owners */}
      {user.role === 'owner' && !loading && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{venuesCount}</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{bookingsCount}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.danger && styles.menuItemDanger,
            ]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIcon,
                  item.danger && styles.menuIconDanger,
                ]}
              >
                <item.icon size={20} color={item.danger ? '#ef4444' : '#3b82f6'} />
              </View>
              <View style={styles.menuItemContent}>
                <Text
                  style={[
                    styles.menuItemTitle,
                    item.danger && styles.menuItemTitleDanger,
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.menuItemSubtitle,
                    item.danger && styles.menuItemSubtitleDanger,
                  ]}
                >
                  {item.subtitle}
                </Text>
              </View>
            </View>
            <ChevronRight
              size={20}
              color={item.danger ? '#ef4444' : '#9ca3af'}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SportBook v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for sports lovers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemDanger: {
    backgroundColor: '#fef2f2',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconDanger: {
    backgroundColor: '#fee2e2',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuItemTitleDanger: {
    color: '#ef4444',
  },
  menuItemSubtitleDanger: {
    color: '#f87171',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
});
