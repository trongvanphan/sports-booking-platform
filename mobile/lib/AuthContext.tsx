/**
 * Auth Context Provider
 * Provides authentication state and methods to the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from './store';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore.getState>['user'] | null;
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, isLoading, isAuthenticated } = useAuthStore();
  const isOwner = user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAuthenticated, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
