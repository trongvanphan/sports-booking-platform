/**
 * SportBook - Sports Facility Booking Mobile App
 * Main entry point with providers and navigation
 */

import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { SupabaseProvider } from './lib/SupabaseContext';
import { AuthProvider } from './lib/AuthContext';
import { useAuthStore } from './lib/store';
import { auth } from './lib/supabase';

// Auth initialization component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading, signOut } = useAuthStore();

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      try {
        const session = await auth.getSession();
        if (session?.user) {
          const profile = await auth.getCurrentUser();
          setAuth(profile as unknown as typeof useAuthStore.getState().user, session.access_token);
        } else {
          setAuth(null, null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        signOut();
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await auth.getCurrentUser();
        setAuth(profile as unknown as typeof useAuthStore.getState().user, session.access_token);
      } else if (event === 'SIGNED_OUT') {
        signOut();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setLoading, signOut]);

  return <>{children}</>;
}

// Loading screen
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading SportBook...</Text>
    </View>
  );
}

// Simple home screen for now
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
        SportBook
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
        Sports Facility Booking Platform
      </Text>
      <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
        Book football stadiums, badminton courts, and pickleball courts near you.
      </Text>
    </View>
  );
}

// Main App component
export default function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AuthInitializer>
          <AppContent />
        </AuthInitializer>
      </AuthProvider>
    </SupabaseProvider>
  );
}

// App content with auth check
function AppContent() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <HomeScreen />;
}
